const mongoose = require('mongoose');
const { productSchema } = require('./product');

const userSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        default: '',
        // validate: {
        //     validator: (value) => {
        //         const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        //         return value.match(re);
        //     },
        //     message: "Please enter a valid email address",
        // },
    },
    pharmacyName: {
        required: true,
        type: String,
    },
    tinNumber: {
        required: true,
        type: String,
    },
    phoneNumber: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
        validate: {
            validator: (value) => {
                return value.length != 4;
            },
            message: "Please enter 4 character pin",
        },
    },
    address: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: 'user',
    },
    verification: {
        type: String,
        default: 'unverified',
    },
    documents: [{
        type: String,
    }],
    cart: [
        {
            product: productSchema,
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;