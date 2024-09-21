"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTIONS_CORS_HEADERS = exports.MESSAGES = exports.MAXAGE = exports.DATABASES = exports.BASEPATH = exports.JWT_SECRET = exports.PORT = void 0;
exports.PORT = process.env.PORT || 9871;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.BASEPATH = "/api/v1";
exports.DATABASES = {
    PRODUCT: "Product",
    USER: "User",
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
    USER: {
        CREATED: "User waitlisted successfully.",
        UPDATED: "User profile updated successfully.",
        FETCHED: "User's info fetched successfully.",
        USER_NOT_FOUND: "User not found.",
        NO_QUERY: "Please provide the needed query."
    },
    TRANSACTION: {
        FETCHED: "Transaction's info fetched successfully.",
        TRANSACTION_NOT_FOUND: "Transaction not found."
    },
    INVALID_ID: "Id doesn't exists.",
    NOT_ID: "Not a valid object Id.",
    UNEXPECTED_ERROR: "An unexpected error occured"
};
exports.ACTIONS_CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Encoding, Accept-Encoding, X-Accept-Action-Version, X-Accept-Blockchain-Ids",
    "Access-Control-Expose-Headers": "X-Action-Version, X-Blockchain-Ids",
    "Content-Type": "application/json",
    "X-Action-Version": "2.1.3",
    "X-Blockchain-Ids": "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1"
};
