import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
},
    {
        timestamps: true,
    }
);

const sizeSchema = mongoose.Schema({
    size: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 }
});

const colorSchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    sizes: [sizeSchema]
});

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    images: [{
        type: String
    }],
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
    colors: [colorSchema],
    isFeatured: {
        type: Boolean,
        default: false,
    },
    discount: {
        type: Number,
        default: 0,
    },
    tags: [{
        type: String
    }],
    specifications: {
        type: Map,
        of: String
    }
},
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;