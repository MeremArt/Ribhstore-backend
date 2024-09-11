import express from 'express';
import TransactionController from '../controllers/transaction.controller';
const { getTransactions } = new TransactionController();
const router = express.Router();

//get all transactions
router.get("/", getTransactions);

export default router;