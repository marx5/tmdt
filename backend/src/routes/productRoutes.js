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
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {};

    const sortOption = req.query.sort || '';
    let sortQuery = {};

    switch (sortOption) {
        case 'price_asc':
            sortQuery = { price: 1 };
            break;
        case 'price_desc':
            sortQuery = { price: -1 };
            break;
        case 'rating_desc':
            sortQuery = { rating: -1 };
            break;
        case 'newest':
            sortQuery = { createdAt: -1 };
            break;
        default:
            sortQuery = { createdAt: -1 };
    }

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .sort(sortQuery)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
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
// @access     Public
router.get('/search', asyncHandler(async (req, res) => {
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {};

    const products = await Product.find({ ...keyword });
    res.json(products);
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
// @access     Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.remove();
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
        countInStock: 0,
        sizes: [],
        colors: [],
        sizeQuantities: {},
        colorQuantities: {},
        isFeatured: false,
        discount: 0,
        tags: [],
        specifications: {}
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
}));

// @desc       Update a product
// @route      PUT /api/products/:id
// @access     Private/Admin
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = req.body.name || product.name;
        product.image = req.body.image || product.image;
        product.images = req.body.images || product.images;
        product.brand = req.body.brand || product.brand;
        product.category = req.body.category || product.category;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.sizes = req.body.sizes || product.sizes;
        product.colors = req.body.colors || product.colors;
        product.sizeQuantities = req.body.sizeQuantities || product.sizeQuantities;
        product.colorQuantities = req.body.colorQuantities || product.colorQuantities;
        product.isFeatured = req.body.isFeatured || product.isFeatured;
        product.discount = req.body.discount || product.discount;
        product.tags = req.body.tags || product.tags;
        product.specifications = req.body.specifications || product.specifications;

        // Tính toán lại tổng số lượng tồn kho
        let totalStock = 0;
        
        // Cộng số lượng từ sizeQuantities
        if (product.sizeQuantities) {
            totalStock += Object.values(product.sizeQuantities).reduce((sum, quantity) => sum + (quantity || 0), 0);
        }
        
        // Cộng số lượng từ colorQuantities
        if (product.colorQuantities) {
            totalStock += Object.values(product.colorQuantities).reduce((sum, quantity) => sum + (quantity || 0), 0);
        }
        
        product.countInStock = totalStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
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

        // Tạm thời bỏ qua kiểm tra mua hàng để cho phép đánh giá
        // if (!hasPurchased) {
        //     res.status(403);
        //     throw new Error('Bạn cần mua sản phẩm trước khi đánh giá');
        // }

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
        res.status(201).json({
            message: 'Đánh giá đã được thêm vào sản phẩm'
        });
    }
    else {
        res.status(404);
        throw new Error('Không tìm thấy sản phẩm');
    }
}));

export default router;