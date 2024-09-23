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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = void 0;
const web3_js_1 = require("@solana/web3.js");
const solanaConnection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("mainnet-beta"));
const getTransactions = (publicKey, numTx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const pubKey = new web3_js_1.PublicKey(publicKey);
        // Fetch the initial balance of the wallet
        const initialBalance = yield solanaConnection.getBalance(pubKey);
        // console.log(initialBalance)
        // Fetch transaction signatures for the address
        const transactionList = yield solanaConnection.getSignaturesForAddress(pubKey, { limit: numTx });
        const transactions = [];
        let currentBalance = initialBalance;
        for (const transaction of transactionList) {
            const date = new Date((transaction.blockTime || 0) * 1000);
            // Fetch transaction details to get the amount transferred
            const txDetails = yield solanaConnection.getTransaction(transaction.signature, { commitment: "confirmed" });
            const amount = (((_a = txDetails === null || txDetails === void 0 ? void 0 : txDetails.meta) === null || _a === void 0 ? void 0 : _a.preBalances[0]) || 0) -
                (((_b = txDetails === null || txDetails === void 0 ? void 0 : txDetails.meta) === null || _b === void 0 ? void 0 : _b.postBalances[0]) || 0);
            transactions.push({
                signature: transaction.signature,
                date: date.toISOString(),
                // status: transaction.confirmationStatus || "unknown",
                amount: Number((amount / 1e9).toFixed(4)), // Convert lamports to SOL
            });
        }
        return (transactions);
    }
    catch (error) {
        console.error("Error fetching transactions from Solana:", error);
        throw new Error("Error fetching transactions from Solana.");
    }
});
exports.getTransactions = getTransactions;
