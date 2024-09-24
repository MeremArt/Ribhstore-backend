"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_config_1 = require("../configs/constants.config");
const productSchema = new mongoose_1.Schema({
    merchantId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: false,
        min: 0
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    strict: true,
    versionKey: false
});
const Product = (0, mongoose_1.model)(constants_config_1.DATABASES.PRODUCT, productSchema, constants_config_1.DATABASES.PRODUCT);
exports.default = Product;
