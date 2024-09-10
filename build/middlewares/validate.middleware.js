"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_util_1 = require("../utils/statusCodes.util");
const response_util_1 = __importDefault(require("../utils/helpers/response.util"));
function validate(schema) {
    return function (req, res, next) {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false
        });
        if (error) {
            let errorMessage = [];
            error.details.forEach(detail => {
                errorMessage.push(detail.message);
            });
            return new response_util_1.default(statusCodes_util_1.FORBIDDEN, false, errorMessage, res);
        }
        req.body = value;
        next();
    };
}
exports.default = validate;
