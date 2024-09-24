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
const web3_js_1 = require("@solana/web3.js");
const { findByName } = new product_service_1.default();
const { UNEXPECTED_ERROR } = constants_config_1.MESSAGES;
class ActionController {
    getAction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("here");
                const baseHref = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`).toString();
                const productName = req.params.name.replace(/-/g, " ");
                const product = yield findByName(productName);
                if (!product) {
                    return new response_util_1.default(statusCodes_util_1.BAD_REQUEST, false, `Invalid product name`, res);
                }
                let payload = {
                    icon: product === null || product === void 0 ? void 0 : product.image,
                    label: `Buy Now (${product === null || product === void 0 ? void 0 : product.price} SOL)`,
                    description: `${product === null || product === void 0 ? void 0 : product.description}`,
                    title: `${product === null || product === void 0 ? void 0 : product.name}`,
                    disabled: product.amount <= 0,
                    links: {
                        actions: [
                            {
                                label: `Buy Now (${product === null || product === void 0 ? void 0 : product.price} USDC)`,
                                href: `${baseHref}?amount={amount}`,
                                parameters: [
                                    {
                                        name: "amount",
                                        label: "Enter a custom quantity",
                                    },
                                ],
                            },
                        ],
                    },
                };
                res.set(constants_config_1.ACTIONS_CORS_HEADERS);
                return res.json(payload);
            }
            catch (error) {
                if (error instanceof httpException_util_1.default) {
                    return new response_util_1.default(error.status, false, error.message, res);
                }
                return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error.message}`, res);
            }
        });
    }
    postAction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productName = req.params.name.replace(/-/g, " ");
                const product = yield findByName(productName);
                if (!product) {
                    return new response_util_1.default(statusCodes_util_1.BAD_REQUEST, false, `Invalid product name`, res);
                }
                const body = req.body;
                // Validate client-provided input
                let account;
                try {
                    account = new web3_js_1.PublicKey(body.account);
                }
                catch (err) {
                    return new response_util_1.default(statusCodes_util_1.BAD_REQUEST, false, "Invalid account provided", res);
                }
                const connection = new web3_js_1.Connection(process.env.SOLANA_RPC || (0, web3_js_1.clusterApiUrl)("devnet"));
                const amount = parseFloat(req.query.amount);
                if (amount <= 0)
                    throw new Error("amount is too small");
                const price = (product === null || product === void 0 ? void 0 : product.price) * amount;
                const sellerPubkey = new web3_js_1.PublicKey(product === null || product === void 0 ? void 0 : product.merchantId);
                product.amount -= amount;
                product.save();
                const transaction = new web3_js_1.Transaction();
                transaction.add(web3_js_1.SystemProgram.transfer({
                    fromPubkey: account,
                    toPubkey: sellerPubkey,
                    lamports: Math.floor(price * web3_js_1.LAMPORTS_PER_SOL),
                }));
                transaction.feePayer = account;
                transaction.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
                const payload = {
                    transaction: transaction
                        .serialize({
                        requireAllSignatures: false,
                        verifySignatures: true,
                    })
                        .toString("base64"),
                    message: `You've successfully purchased ${product === null || product === void 0 ? void 0 : product.name} for ${price} USDC 🎊`,
                };
                res.set(constants_config_1.ACTIONS_CORS_HEADERS);
                return res.status(200).json(payload);
            }
            catch (error) {
                if (error instanceof httpException_util_1.default) {
                    return new response_util_1.default(error.status, false, error.message, res);
                }
                return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error.message}`, res);
            }
        });
    }
}
exports.default = ActionController;
