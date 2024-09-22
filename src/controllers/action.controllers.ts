import { Request, Response } from "express";
import ProductService from "../services/product.service";
import CustomResponse from "../utils/helpers/response.util";
import { ACTIONS_CORS_HEADERS, MESSAGES } from "../configs/constants.config";
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
import { ActionGetResponse, ActionPostRequest, ActionPostResponse } from "@solana/actions";

const { findByName } = new ProductService();
const { UNEXPECTED_ERROR } = MESSAGES;

export default class ActionController {

  async getAction(req: Request, res: Response) {
    try {
      console.log("here")
      const baseHref = new URL(
        `${req.protocol}://${req.get('host')}${req.originalUrl}`
      ).toString();

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
        disabled: product.amount <= 0,
        links: {
          actions: [
            {
              label: `Buy Now (${product?.price} SOL)`,
              href: `${baseHref}?amount={amount}`,
              parameters: [
                {
                  name: "amount",
                  label: "Enter a custom quantity"
                }
              ]
            }
          ]
        }
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

      const connection = new Connection(process.env.SOLANA_RPC! || clusterApiUrl("mainnet-beta"));

      const amount = parseFloat(req.query.amount as any);
      if (amount <= 0) throw new Error("amount is too small");

      const price = product?.price! * amount;
      const sellerPubkey: PublicKey = new PublicKey(product?.merchantId as string);

      product.amount -= amount;
      product.save();
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