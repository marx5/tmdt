import express from 'express';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';

// Model
import Order from '../models/orderModel.js'

// Auth middleware
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc       Create new order
// @route      POST /api/orders
// @access     Private
router.post('/', protect, asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentResult,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // Tạo đơn hàng mới
    const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentResult,
    });

    // Nếu là thanh toán PayPal và có kết quả thanh toán
    if (paymentMethod === 'PayPal' && paymentResult) {
        order.isPaid = true;
        order.paidAt = Date.now();
    }

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
}));

// @desc       Get all orders of the logged in user
// @route      GET /api/orders/myorders
// @access     Private
router.get('/myorders', protect, asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200);
    res.json(orders);    
}));

// @desc       Get all orders
// @route      GET /api/orders/allorders
// @access     Private
router.get('/allorders', protect, admin, asyncHandler(async (req, res) => {
    const orders = await Order.find({ }).populate('user', 'id name') ;
    res.status(200);
    res.json(orders);    
}));

// @desc       Get an order by its ID
// @route      GET /api/orders/:id
// @access     Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (order) {
        res.status(200);
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
}));

// @desc       Update payment status and details of an order
// @route      PUT /api/orders/:id/pay
// @access     Private
router.put('/:id/pay', protect, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };
        const updatedOrder = await order.save();
        res.status(200);
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
}));

// @desc       Update delivered status of an order
// @route      PUT /api/orders/:id/deliver
// @access     Private/Admin
router.put('/:id/deliver', protect, admin, asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.status(200);
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
}));

// @desc       Create MoMo payment
// @route      POST /api/orders/momo
// @access     Private
router.post('/momo', protect, asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // Tạo đơn hàng mới
    const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod: 'MoMo',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    const createdOrder = await order.save();

    // Tạo request thanh toán MoMo
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const requestId = partnerCode + new Date().getTime();
    const orderId = createdOrder._id;
    const orderInfo = "Thanh toán đơn hàng " + orderId;
    const redirectUrl = `${process.env.FRONTEND_URL}/order/${orderId}`;
    const ipnUrl = `${process.env.BACKEND_URL}/api/orders/momo/ipn`;
    const amount = totalPrice;
    const requestType = "captureWallet";
    const extraData = "";

    // Tạo signature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    // Gửi request đến MoMo
    const requestBody = {
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: 'vi'
    };

    // Gọi API MoMo
    const response = await fetch('https://test-payment.momo.vn/v2/gateway/api/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    if (data.resultCode === 0) {
        res.json({
            order: createdOrder,
            payUrl: data.payUrl
        });
    } else {
        res.status(400);
        throw new Error(data.message || 'Lỗi khi tạo thanh toán MoMo');
    }
}));

// @desc       MoMo IPN (Instant Payment Notification)
// @route      POST /api/orders/momo/ipn
// @access     Public
router.post('/momo/ipn', asyncHandler(async (req, res) => {
    const {
        partnerCode,
        orderId,
        requestId,
        amount,
        orderInfo,
        orderType,
        transId,
        resultCode,
        message,
        payType,
        responseTime,
        extraData,
        signature
    } = req.body;

    // Verify signature
    const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    const expectedSignature = crypto.createHmac('sha256', process.env.MOMO_SECRET_KEY)
        .update(rawSignature)
        .digest('hex');

    if (signature !== expectedSignature) {
        res.status(400);
        throw new Error('Invalid signature');
    }

    // Update order status
    const order = await Order.findById(orderId);
    if (order) {
        if (resultCode === 0) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: transId,
                status: 'success',
                update_time: responseTime,
                message: message
            };
        } else {
            order.paymentResult = {
                id: transId,
                status: 'failed',
                update_time: responseTime,
                message: message
            };
        }
        await order.save();
    }

    res.status(200).json({ message: 'IPN received' });
}));

export default router;