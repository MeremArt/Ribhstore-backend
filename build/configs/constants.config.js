"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGES = exports.MAXAGE = exports.DATABASES = exports.BASEPATH = exports.JWT_SECRET = exports.PORT = void 0;
exports.PORT = process.env.PORT || 9871;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.BASEPATH = "/api/v1";
exports.DATABASES = {
    PRODUCT: "Product",
};
exports.MAXAGE = 3 * 24 * 60 * 60;
exports.MESSAGES = {
    DATABASE: {
        CONNECTED: "Connection to database has been established successfully",
        ERROR: "Unable to connect to database."
    },
    PRODUCT: {
        CREATED: "Product added successfully.",
        FETCHED: "Product's info fetched successfully.",
        PRODUCT_NOT_FOUND: "Product not found.",
        NO_QUERY: "Please provide the needed query."
    },
    INVALID_ID: "Id doesn't exists.",
    NOT_ID: "Not a valid object Id.",
    UNEXPECTED_ERROR: "An unexpected error occured"
};
