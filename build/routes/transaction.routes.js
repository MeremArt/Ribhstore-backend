"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = __importDefault(require("../controllers/transaction.controller"));
const { getTransactions } = new transaction_controller_1.default();
const router = express_1.default.Router();
//get all transactions
router.get("/", getTransactions);
exports.default = router;
