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
const constants_config_1 = require("../configs/constants.config");
const base_repository_1 = __importDefault(require("../repositories/base.repository"));
const product_model_1 = __importDefault(require("../models/product.model"));
const httpException_util_1 = __importDefault(require("../utils/helpers/httpException.util"));
const statusCodes_util_1 = require("../utils/statusCodes.util");
const mongoose_1 = require("mongoose");
const ProductRepository = new base_repository_1.default(product_model_1.default);
const { PRODUCT_NOT_FOUND } = constants_config_1.MESSAGES.PRODUCT;
class ProductService {
    create(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ProductRepository.create(product);
            }
            catch (error) {
                throw new httpException_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, error.message);
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(0, mongoose_1.isValidObjectId)(id)) {
                    throw new httpException_util_1.default(statusCodes_util_1.BAD_REQUEST, constants_config_1.MESSAGES.NOT_ID);
                }
                const product = yield ProductRepository.findById(id);
                if (!product)
                    throw new httpException_util_1.default(statusCodes_util_1.NOT_FOUND, PRODUCT_NOT_FOUND);
                return product;
            }
            catch (error) {
                if ((error.status === statusCodes_util_1.NOT_FOUND) || (error.status === constants_config_1.MESSAGES.NOT_ID))
                    throw error;
                throw new httpException_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, error.message);
            }
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield ProductRepository.findOne({ name });
                return product;
            }
            catch (error) {
                if ((error.status === statusCodes_util_1.NOT_FOUND) || (error.status === constants_config_1.MESSAGES.NOT_ID))
                    throw error;
                throw new httpException_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, error.message);
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield ProductRepository.find();
                return product;
            }
            catch (error) {
                if ((error.status === statusCodes_util_1.NOT_FOUND) || (error.status === constants_config_1.MESSAGES.NOT_ID))
                    throw error;
                throw new httpException_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, error.message);
            }
        });
    }
    count(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield ProductRepository.countDocuments(params);
                return count;
            }
            catch (error) {
                if ((error.status === statusCodes_util_1.NOT_FOUND) || (error.status === constants_config_1.MESSAGES.NOT_ID))
                    throw error;
                throw new httpException_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, error.message);
            }
        });
    }
}
exports.default = ProductService;
