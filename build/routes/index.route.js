"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_route_1 = __importDefault(require("./product.route"));
const transaction_routes_1 = __importDefault(require("./transaction.routes"));
const statusCodes_util_1 = require("../utils/statusCodes.util");
const router = (0, express_1.Router)();
const response_util_1 = __importDefault(require("../utils/helpers/response.util"));
/**API base route */
router.get("/", (req, res) => {
    return new response_util_1.default(statusCodes_util_1.OK, true, "Welcome to RibhStore API ensure to go through the API docs before using this service", res);
});
router.use("/product", product_route_1.default);
router.use("/transaction", transaction_routes_1.default);
exports.default = router;
