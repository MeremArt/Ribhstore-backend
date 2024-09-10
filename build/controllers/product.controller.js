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
const { create, findById, findAll } = new product_service_1.default();
const { CREATED, FETCHED, NO_QUERY } = constants_config_1.MESSAGES.PRODUCT;
const { UNEXPECTED_ERROR } = constants_config_1.MESSAGES;
class ProductController {
    addProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const product = yield create(data);
                return new response_util_1.default(statusCodes_util_1.ADDED, true, CREATED, res, product);
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
}
exports.default = ProductController;
