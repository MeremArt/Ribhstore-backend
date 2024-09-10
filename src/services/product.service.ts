import { MESSAGES } from "../configs/constants.config";
import IProduct from "../interfaces/product.interface";
import BaseRepository from "../repositories/base.repository";
import Product from "../models/product.model";
import HttpException from "../utils/helpers/httpException.util";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../utils/statusCodes.util";
import { isValidObjectId } from "mongoose";
const ProductRepository = new BaseRepository(
    Product
);
const { PRODUCT_NOT_FOUND } = MESSAGES.PRODUCT;

export default class ProductService {

    async create(product: IProduct) {
        try {

            return await ProductRepository.create(product);

        } catch (error: any) {

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async findById(id: string) {
        try {

            if (!isValidObjectId(id)) {
                throw new HttpException(BAD_REQUEST, MESSAGES.NOT_ID);
            }
            const product = await ProductRepository.findById(id);

            if (!product) throw new HttpException(NOT_FOUND, PRODUCT_NOT_FOUND);

            return product;

        } catch (error: any) {

            if ((error.status === NOT_FOUND) || (error.status === MESSAGES.NOT_ID)) throw error;

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async findByName(name: string) {
        try {

            const product = await ProductRepository.findOne({ name });

            return product;

        } catch (error: any) {

            if ((error.status === NOT_FOUND) || (error.status === MESSAGES.NOT_ID)) throw error;

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    async findAll() {
        try {
            const product = await ProductRepository.find();

            return product;

        } catch (error: any) {

            if ((error.status === NOT_FOUND) || (error.status === MESSAGES.NOT_ID)) throw error;

            throw new HttpException(INTERNAL_SERVER_ERROR, error.message);
        }
    }

}
