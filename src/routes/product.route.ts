import express from 'express';
import ProductController from '../controllers/product.controller';
import validate from '../middlewares/validate.middleware';
import { createSchema } from '../schemas/product.schema';
import upload from '../configs/multer.configs';
const { addProduct, getProductById, getProducts, getProductCount, uploadImage } = new ProductController();
const router = express.Router();

//add a product
router.post("/", validate(createSchema), addProduct);

//get a product by id
router.get("/:id", getProductById);

//get a product by id
router.get("/count/:id", getProductCount);

//get all products
router.get("/", getProducts);

//upload profile image
router.post("/upload", upload.single("image"), uploadImage);

export default router;