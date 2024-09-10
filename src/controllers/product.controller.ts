import ProductService from "../services/product.service";
import { Request, Response } from "express";
import CustomResponse from "../utils/helpers/response.util";
import { MESSAGES } from "../configs/constants.config";
import { INTERNAL_SERVER_ERROR, OK, ADDED, BAD_REQUEST } from "../utils/statusCodes.util";
import HttpException from "../utils/helpers/httpException.util";
const {
    create,
    findById,
    findAll
} = new ProductService();
const {
    CREATED,
    FETCHED,
    NO_QUERY
} = MESSAGES.PRODUCT;
const {
    UNEXPECTED_ERROR
} = MESSAGES;

export default class ProductController {

    async addProduct(req: Request, res: Response) {

        try {

            const data = req.body;

            const product = await create(data);

            return new CustomResponse(ADDED, true, CREATED, res, product);

        } catch (error) {

            if (error instanceof HttpException) {

                return new CustomResponse(error.status, false, error.message, res);

            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error}`, res);
        }
    }

    async getProductById(req: Request, res: Response) {

        try {

            const id = req.params.id;

            const product = await findById(id);

            return new CustomResponse(OK, true, FETCHED, res, product);

        } catch (error) {

            if (error instanceof HttpException) {

                return new CustomResponse(error.status, false, error.message, res);

            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}\n Error: ${error}`, res);
        }
    }

    async getProducts(req: Request, res: Response) {

        try {

            const product = await findAll();

            return new CustomResponse(OK, true, FETCHED, res, product);

        } catch (error) {

            if (error instanceof HttpException) {

                return new CustomResponse(error.status, false, error.message, res);

            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}\n Error: ${error}`, res);
        }
    }
}