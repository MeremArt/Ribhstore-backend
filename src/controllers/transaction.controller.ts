import { Request, Response } from "express";
import CustomResponse from "../utils/helpers/response.util";
import { MESSAGES } from "../configs/constants.config";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from "../utils/statusCodes.util";
import HttpException from "../utils/helpers/httpException.util";
import { getTransactions } from "../services/transaction.service";
const {
    FETCHED,
    TRANSACTION_NOT_FOUND
} = MESSAGES.TRANSACTION;
const {
    UNEXPECTED_ERROR
} = MESSAGES;

export default class TransactionController {

    async getTransactions(req: Request, res: Response) {

        try {

            const { publicKey, numTx } = req.query;

            // Validate inputs
            // if (!publicKey || !numTx) {
            //     return new CustomResponse(BAD_REQUEST, false, TRANSACTION_NOT_FOUND, res);
            // }

            const transactions = await getTransactions(String("Dfo4P23Au7U5ZdZV8myrh3j7gY4HKai7qoVop33EaKwd"), Number(numTx));

            return new CustomResponse(OK, true, FETCHED, res, transactions);

        } catch (error) {

            if (error instanceof HttpException) {

                return new CustomResponse(error.status, false, error.message, res);

            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}\n Error: ${error}`, res);
        }
    }
}