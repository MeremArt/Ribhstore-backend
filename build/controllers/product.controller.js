"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_service_1 = __importDefault(require("../services/product.service"));
const response_util_1 = __importDefault(require("../utils/helpers/response.util"));
const constants_config_1 = require("../configs/constants.config");
const statusCodes_util_1 = require("../utils/statusCodes.util");
const httpException_util_1 = __importDefault(require("../utils/helpers/httpException.util"));
const cloudinary_configs_1 = __importDefault(require("../configs/cloudinary.configs"));
const { create, findById, findAll, findByName, count } = new product_service_1.default();
const { CREATED, FETCHED, NO_QUERY } = constants_config_1.MESSAGES.PRODUCT;
const { UNEXPECTED_ERROR } = constants_config_1.MESSAGES;
const deployedLink = "https://dial.to/?action=solana-action:https://www.ribh.xyz";
class ProductController {
    addProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (yield findByName(data.name)) {
                    return new response_util_1.default(statusCodes_util_1.BAD_REQUEST, false, `Product with the same name already exists`, res);
                }
                const product = yield create(data);
                const encodedProductName = product === null || product === void 0 ? void 0 : product.name.replace(/\s+/g, '-');
                return new response_util_1.default(statusCodes_util_1.ADDED, true, CREATED, res, {
                    product,
                    blink: `${deployedLink}/${encodedProductName}`
                });
            }
            catch (error) {
                if (error instanceof httpException_util_1.default) {
                    return new response_util_1.default(error.status, false, error.message, res);
                }
                return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error}`, res);
            }
        });
    }
    getProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const product = yield findById(id);
                const encodedProductName = product === null || product === void 0 ? void 0 : product.name.replace(/\s+/g, '-');
                return new response_util_1.default(statusCodes_util_1.OK, true, FETCHED, res, {
                    product,
                    blink: `${deployedLink}/${encodedProductName}`
                });
            }
            catch (error) {
                if (error instanceof httpException_util_1.default) {
                    return new response_util_1.default(error.status, false, error.message, res);
                }
                return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}\n Error: ${error}`, res);
            }
        });
    }
    getProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield findAll();
                return new response_util_1.default(statusCodes_util_1.OK, true, FETCHED, res, product);
            }
            catch (error) {
                if (error instanceof httpException_util_1.default) {
                    return new response_util_1.default(error.status, false, error.message, res);
                }
                return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}\n Error: ${error}`, res);
            }
        });
    }
    getProductCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productCount = yield count({ merchantId: req.params.id });
                return new response_util_1.default(statusCodes_util_1.OK, true, FETCHED, res, { productCount });
            }
            catch (error) {
                if (error instanceof httpException_util_1.default) {
                    return new response_util_1.default(error.status, false, error.message, res);
                }
                return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}\n Error: ${error}`, res);
            }
        });
    }
    uploadImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let imageUrl;
                if (req.file) {
                    // Upload file to Cloudinary
                    const result = yield cloudinary_configs_1.default.uploader.upload(req.file.path, { folder: "RibhStore" });
                    imageUrl = result.secure_url;
                    if (!imageUrl) {
                        return res.status(409).send({
                            success: false,
                            message: "File Upload Failed"
                        });
                    }
                    return res.status(201)
                        .send({
                        success: true,
                        message: "Image uploaded successfully",
                        imageUrl
                    });
                }
                return res.status(409).send({
                    success: false,
                    message: "Include an Image file"
                });
            }
            catch (err) {
                return res.status(500).send({
                    success: false,
                    message: err.message
                });
            }
        });
    }
}
exports.default = ProductController;
