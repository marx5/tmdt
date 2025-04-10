import express from 'express';
import asyncHandler from 'express-async-handler';

// Model
import Product from '../models/productModel.js'
import Order from '../models/orderModel.js'

// Auth middlewares
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc       Fetch all products
// @route      GET /api/products
// @access     Public
router.get('/', asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
}));

// @desc       Fetch top rated products
// @route      GET /api/products/toprated
// @access     Public
router.get('/toprated', asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.json(products);
}));

// @desc       Search for products
// @route      GET /api/products/search?keyword=-----
// @access     Private
router.post('/search', asyncHandler(async (req, res) => {
    const results = await Product.find({
        name: { $regex: req.query.keyword, $options: 'i' }
    });
    res.status(200);
    res.json(results);
}));

// @desc       Fetch a single product
// @route      GET /api/products/:id
// @access     Public
router.get('/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    }
    else {
        res.status(404).json({ message: 'Product not found!' });
    }
}));

// @desc       Delete a single product
// @route      DELETE /api/products/:id
// @access     Public
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.remove();
        res.status(200);
        res.json({ message: 'Product removed' });
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }

}));

// @desc       Create a single product
// @route      POST /api/products
// @access     Private/Admin
router.post('/', protect, admin, asyncHandler(async (req, res) => {
    const product = new Product({
        user: req.user._id,
        name: 'Sample',
        image: '/images/sample.jpg',
        images: [],
        brand: 'Sample brand',
        category: 'Sample category',
        description: 'Sample description',
        rating: 0,
        numReviews: 0,
        price: 0,
        colors: [],
        countInStock: 0
    });

    await product.save();
    res.status(201);
    res.json(product);
}));

// @desc       Update a product
// @route      PUT /api/products/:id
// @access     Private/Admin
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = req.body.name;
        product.image = req.body.image;
        product.images = req.body.images;
        product.brand = req.body.brand;
        product.category = req.body.category;
        product.description = req.body.description;
        product.price = req.body.price;
        product.colors = req.body.colors;
        product.countInStock = req.body.colors.reduce((total, color) => 
            total + color.sizes.reduce((sum, size) => sum + size.quantity, 0), 0);

        await product.save();
        res.status(200);
        res.json(product);
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
}));

// @desc       Add review to a product
// @route      POST /api/products/:id/reviews
// @access     Private
router.post('/:id/reviews', protect, asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
        const isReviewedByUser = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );

        // Nếu sản phẩm đã được đánh giá bởi người dùng
        if (isReviewedByUser) {
            res.status(400);
            throw new Error('Sản phẩm đã được đánh giá bởi bạn');
        }

        // Kiểm tra xem người dùng đã mua sản phẩm này chưa
        const orders = await Order.find({
            user: req.user._id,
            isPaid: true // Chỉ xét các đơn hàng đã thanh toán
        });

        // Kiểm tra xem sản phẩm có trong bất kỳ đơn hàng nào của người dùng không
        const hasPurchased = orders.some(order =>
            order.orderItems.some(item =>
                item.product.toString() === req.params.id
            )
        );

        if (!hasPurchased) {
            res.status(403);
            throw new Error('Bạn cần mua sản phẩm trước khi đánh giá');
        }

        // Thêm đánh giá
        const review = {
            name: req.user.name,
            rating: Number(req.body.rating),
            comment: req.body.comment,
            user: req.user._id
        };
        product.reviews.push(review);

        // Tính toán số lượng đánh giá
        product.numReviews = product.reviews.length;

        // Tính toán điểm đánh giá trung bình
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201);
        res.json({
            message: 'Đánh giá đã được thêm vào sản phẩm'
        });
    }
    else {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm');
    }
}));

export default router;