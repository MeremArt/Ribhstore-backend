import { Request, Response } from "express";
import ProductService from "../services/product.service";
import CustomResponse from "../utils/helpers/response.util";
import { MESSAGES } from "../configs/constants.config";
import { INTERNAL_SERVER_ERROR, OK, BAD_REQUEST } from "../utils/statusCodes.util";
import HttpException from "../utils/helpers/httpException.util";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse } from "@solana/actions";

const { findByName } = new ProductService();
const { UNEXPECTED_ERROR } = MESSAGES;

export default class ActionController {

  async getAction(req: Request, res: Response) {
    try {
      const productName = req.params.name.replace(/-/g, ' ');
      const product = await findByName(productName);

      if (!product) {
        return new CustomResponse(BAD_REQUEST, false, `Invalid product name`, res);
      }

      let payload: ActionGetResponse = {
        icon: product?.image as unknown as string,
        label: `Buy Now (${product?.price} SOL)`,
        description: `${product?.description}`,
        title: `${product?.name}`,
      };

      res.set(ACTIONS_CORS_HEADERS);
      return res.json(payload);

    } catch (error: any) {
      if (error instanceof HttpException) {
        return new CustomResponse(error.status, false, error.message, res);
      }
      return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error.message}`, res);
    }
  }

  async postAction(req: Request, res: Response) {
    try {
      const productName = req.params.name.replace(/-/g, ' ');
      const product = await findByName(productName);

      if (!product) {
        return new CustomResponse(BAD_REQUEST, false, `Invalid product name`, res);
      }

      const body: ActionPostRequest = req.body;

      // Validate client-provided input
      let account: PublicKey;
      try {
        account = new PublicKey(body.account);
      } catch (err) {
        return new CustomResponse(BAD_REQUEST, false, 'Invalid account provided', res);
      }

      const connection = new Connection(process.env.SOLANA_RPC! || clusterApiUrl("devnet"));

      const minimumBalance = await connection.getMinimumBalanceForRentExemption(0);

      const price = product?.price!;
      const sellerPubkey: PublicKey = new PublicKey(product?.merchantId as string);

      // if (price * LAMPORTS_PER_SOL < minimumBalance) {
      //   throw new HttpException(BAD_REQUEST, `Account may not be rent exempt: ${sellerPubkey.toBase58()}`);
      // }

      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: account,
          toPubkey: sellerPubkey,
          lamports: Math.floor(price * LAMPORTS_PER_SOL),
        })
      );
      transaction.feePayer = account;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const payload: ActionPostResponse = {
        transaction: transaction.serialize({
          requireAllSignatures: false,
          verifySignatures: true,
        }).toString('base64'),
        message: `You've successfully purchased ${product?.name} for ${price} SOL 🎊`,
      };

      res.set(ACTIONS_CORS_HEADERS);
      return res.status(200).json(payload);

    } catch (error: any) {
      if (error instanceof HttpException) {
        return new CustomResponse(error.status, false, error.message, res);
      }
      return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error.message}`, res);
    }
  }
}