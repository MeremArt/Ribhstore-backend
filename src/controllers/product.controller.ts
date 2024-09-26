import ProductService from "../services/product.service";
import { Request, Response } from "express";
import CustomResponse from "../utils/helpers/response.util";
import { MESSAGES } from "../configs/constants.config";
import { INTERNAL_SERVER_ERROR, OK, ADDED, BAD_REQUEST } from "../utils/statusCodes.util";
import HttpException from "../utils/helpers/httpException.util";
import cloudinary from "../configs/cloudinary.configs";
const {
    create,
    findById,
    findAll,
    findByName,
    count
} = new ProductService();
const {
    CREATED,
    FETCHED,
    NO_QUERY
} = MESSAGES.PRODUCT;
const {
    UNEXPECTED_ERROR
} = MESSAGES;
const deployedLink = "https://dial.to/?action=solana-action:https://www.ribh.xyz";

export default class ProductController {

    async addProduct(req: Request, res: Response) {

        try {

            const data = req.body;

            if (await findByName(data.name)) {
                return new CustomResponse(BAD_REQUEST, false, `Product with the same name already exists`, res);
            }
            const product = await create(data);
            const encodedProductName = product?.name.replace(/\s+/g, '-');

            return new CustomResponse(ADDED, true, CREATED, res, {
                product,
                blink: `${deployedLink}/${encodedProductName}`
            });

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
            const encodedProductName = product?.name.replace(/\s+/g, '-');

            return new CustomResponse(OK, true, FETCHED, res, {
                product,
                blink: `${deployedLink}/${encodedProductName}`
            });

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

    async getProductCount(req: Request, res: Response) {

        try {

            const productCount = await count({ merchantId: req.params.id });

            return new CustomResponse(OK, true, FETCHED, res, { productCount });

        } catch (error) {

            if (error instanceof HttpException) {

                return new CustomResponse(error.status, false, error.message, res);

            }
            return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}\n Error: ${error}`, res);
        }
    }

    async uploadImage(req: Request, res: Response) {
        try {
            let imageUrl;
            if (req.file) {
                // Upload file to Cloudinary
                const result = await cloudinary.uploader.upload(req.file.path, { folder: "RibhStore" });
                imageUrl = result.secure_url;
                if (!imageUrl) {
                    return res.status(409).send({
                        success: false,
                        message: "File Upload Failed"
                    });
                }
                return res.status(201)
                    .send({
                        success: true,
                        message: "Image uploaded successfully",
                        imageUrl
                    });
            }
            return res.status(409).send({
                success: false,
                message: "Include an Image file"
            });
        } catch (err: any) {
            return res.status(500).send({
                success: false,
                message: err.message
            });
        }
    }

}