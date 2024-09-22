"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_config_1 = require("../configs/constants.config");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    twitterId: {
        type: String,
        required: false,
        default: null,
        trim: true
    },
    pubKey: {
        type: String,
        required: false,
        default: null,
        trim: true
    },
    hasAccess: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    strict: true,
    versionKey: false
});
const User = (0, mongoose_1.model)(constants_config_1.DATABASES.USER, userSchema, constants_config_1.DATABASES.USER);
exports.default = User;
