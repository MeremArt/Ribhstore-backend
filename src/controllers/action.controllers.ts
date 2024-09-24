import { Request, Response } from "express";
import ProductService from "../services/product.service";
import CustomResponse from "../utils/helpers/response.util";
import { ACTIONS_CORS_HEADERS, MESSAGES } from "../configs/constants.config";
import * as splToken from "@solana/spl-token";
import {
  INTERNAL_SERVER_ERROR,
  OK,
  BAD_REQUEST,
} from "../utils/statusCodes.util";
import HttpException from "../utils/helpers/httpException.util";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  createPostResponse,
} from "@solana/actions";

const { findByName } = new ProductService();
const { UNEXPECTED_ERROR } = MESSAGES;
const SOLANA_MAINNET_USDC_PUBKEY = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export default class ActionController {
  async getAction(req: Request, res: Response) {
    try {
      console.log("here");
      const baseHref = new URL(
        `${req.protocol}://${req.get("host")}${req.originalUrl}`
      ).toString();

      const productName = req.params.name.replace(/-/g, " ");
      const product = await findByName(productName);

      if (!product) {
        return new CustomResponse(
          BAD_REQUEST,
          false,
          `Invalid product name`,
          res
        );
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
              label: `Buy Now (${product?.price} USDC)`,
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

      res.set(ACTIONS_CORS_HEADERS);
      return res.json(payload);
    } catch (error: any) {
      if (error instanceof HttpException) {
        return new CustomResponse(error.status, false, error.message, res);
      }
      return new CustomResponse(
        INTERNAL_SERVER_ERROR,
        false,
        `${UNEXPECTED_ERROR}: ${error.message}`,
        res
      );
    }
  }

  async postAction(req: Request, res: Response) {
    try {
      const productName = req.params.name.replace(/-/g, " ");
      const product = await findByName(productName);

      if (!product) {
        return new CustomResponse(
          BAD_REQUEST,
          false,
          `Invalid product name`,
          res
        );
      }

      const body: ActionPostRequest = req.body;

      // Validate client-provided input
      let account: PublicKey;
      try {
        account = new PublicKey(body.account);
      } catch (err) {
        return new Response('Invalid "account" provided', {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        });
      }

      const connection = new Connection(
        process.env.SOLANA_RPC! || clusterApiUrl("devnet")
      );

      const quantity = parseFloat(req.query.amount as any);
      if (quantity <= 0) throw new Error("amount is too small");

      const amount = product?.price! * quantity;
      const sellerPubkey: PublicKey = new PublicKey(
        product?.merchantId as string
      );

      product.amount -= quantity;
      await product.save();
  
      // const connection = new Connection(clusterApiUrl("mainnet-beta"));
      const decimals = 6; // In the example, we use 6 decimals for USDC, but you can use any SPL token
      const mintAddress = new PublicKey(SOLANA_MAINNET_USDC_PUBKEY);
    
      let transferAmount: any = parseFloat(amount.toString());
      transferAmount = transferAmount.toFixed(decimals);
      transferAmount = transferAmount * Math.pow(10, decimals);
  
      const fromTokenAccount = await splToken.getAssociatedTokenAddress(
        mintAddress,
        account,
        false,
        splToken.TOKEN_PROGRAM_ID,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID
      );
  
      let toTokenAccount = await splToken.getAssociatedTokenAddress(
        mintAddress,
        sellerPubkey,
        true,
        splToken.TOKEN_PROGRAM_ID,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID
      );
  
      const ifexists = await connection.getAccountInfo(toTokenAccount);
  
      let instructions = [];
  
      if (!ifexists || !ifexists.data) {
        let createATAiX = splToken.createAssociatedTokenAccountInstruction(
          account,
          toTokenAccount,
          sellerPubkey,
          mintAddress,
          splToken.TOKEN_PROGRAM_ID,
          splToken.ASSOCIATED_TOKEN_PROGRAM_ID
        );
        instructions.push(createATAiX);
      }
  
      let transferInstruction = splToken.createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        account,
        transferAmount
      );
      instructions.push(transferInstruction);
  
      const transaction = new Transaction();
      transaction.feePayer = account;
  
      transaction.add(...instructions);
  
      // set the end user as the fee payer
      transaction.feePayer = account;
  
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          transaction,
          message: `You've successfully purchased ${quantity} ${product?.name} for ${amount} USDC 🎊`,
        }
      });
  

      res.set(ACTIONS_CORS_HEADERS);
      return res.status(200).json(payload);
    } catch (error: any) {
      if (error instanceof HttpException) {
        return new CustomResponse(error.status, false, error.message, res);
      }
      return new CustomResponse(
        INTERNAL_SERVER_ERROR,
        false,
        `${UNEXPECTED_ERROR}: ${error.message}`,
        res
      );
    }
  }
}
