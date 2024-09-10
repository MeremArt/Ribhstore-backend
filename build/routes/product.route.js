"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const validate_middleware_1 = __importDefault(require("../middlewares/validate.middleware"));
const product_schema_1 = require("../schemas/product.schema");
const { addProduct, getProductById, getProducts } = new product_controller_1.default();
const router = express_1.default.Router();
//add a product
router.post("/", (0, validate_middleware_1.default)(product_schema_1.createSchema), addProduct);
//get a product by id
router.get("/:id", getProductById);
//get all products
router.get("/", getProducts);
exports.default = router;
