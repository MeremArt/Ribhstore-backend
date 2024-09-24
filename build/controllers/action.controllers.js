"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const splToken = __importStar(require("@solana/spl-token"));
const statusCodes_util_1 = require("../utils/statusCodes.util");
const httpException_util_1 = __importDefault(require("../utils/helpers/httpException.util"));
const web3_js_1 = require("@solana/web3.js");
const actions_1 = require("@solana/actions");
const { findByName } = new product_service_1.default();
const { UNEXPECTED_ERROR } = constants_config_1.MESSAGES;
const SOLANA_MAINNET_USDC_PUBKEY = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
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
                    return new Response('Invalid "account" provided', {
                        status: 400,
                        headers: constants_config_1.ACTIONS_CORS_HEADERS,
                    });
                }
                const connection = new web3_js_1.Connection(process.env.SOLANA_RPC || (0, web3_js_1.clusterApiUrl)("mainnet-beta"));
                const quantity = parseFloat(req.query.amount);
                if (quantity <= 0)
                    throw new Error("amount is too small");
                const amount = (product === null || product === void 0 ? void 0 : product.price) * quantity;
                const sellerPubkey = new web3_js_1.PublicKey(product === null || product === void 0 ? void 0 : product.merchantId);
                product.amount = product.amount - quantity;
                yield product.save();
                // const connection = new Connection(clusterApiUrl("mainnet-beta"));
                const decimals = 6; // In the example, we use 6 decimals for USDC, but you can use any SPL token
                const mintAddress = new web3_js_1.PublicKey(SOLANA_MAINNET_USDC_PUBKEY);
                let transferAmount = parseFloat(amount.toString());
                transferAmount = transferAmount.toFixed(decimals);
                transferAmount = transferAmount * Math.pow(10, decimals);
                const fromTokenAccount = yield splToken.getAssociatedTokenAddress(mintAddress, account, false, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
                let toTokenAccount = yield splToken.getAssociatedTokenAddress(mintAddress, sellerPubkey, true, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
                const ifexists = yield connection.getAccountInfo(toTokenAccount);
                let instructions = [];
                if (!ifexists || !ifexists.data) {
                    let createATAiX = splToken.createAssociatedTokenAccountInstruction(account, toTokenAccount, sellerPubkey, mintAddress, splToken.TOKEN_PROGRAM_ID, splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
                    instructions.push(createATAiX);
                }
                let transferInstruction = splToken.createTransferInstruction(fromTokenAccount, toTokenAccount, account, transferAmount);
                instructions.push(transferInstruction);
                const transaction = new web3_js_1.Transaction();
                transaction.feePayer = account;
                transaction.add(...instructions);
                // set the end user as the fee payer
                transaction.feePayer = account;
                transaction.recentBlockhash = (yield connection.getLatestBlockhash()).blockhash;
                const payload = yield (0, actions_1.createPostResponse)({
                    fields: {
                        transaction,
                        message: `You've successfully purchased ${quantity} ${product === null || product === void 0 ? void 0 : product.name} for ${amount} USDC 🎊`,
                    }
                });
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
