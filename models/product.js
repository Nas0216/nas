const mongoose = require('mongoose');
const ratingSchema = require('./rating');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    brand: {
        type: String,
        trim: true,
    },
    dosageForm: {
        type: String,
        trim: true,
    },
    strength: {
        type: String,
    },
    batchNumber: {
        type: String,
        required: true,
        trim: true,
    },
    expiryDate: {
        type: String,
        required: true,
        trim: true,
    },
    images: [{
        type: String,
    }],
    category: {
        type: String,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    ratings: [ratingSchema],
});

const Product = mongoose.model("Product", productSchema);
module.exports = {Product, productSchema};