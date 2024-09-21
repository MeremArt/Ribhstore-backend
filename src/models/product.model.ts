import { model, Schema } from "mongoose";
import IProduct from "../interfaces/product.interface";
import { DATABASES } from "../configs/constants.config";

const productSchema = new Schema<IProduct>({
    merchantId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: false,
        min: 0
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    }
}, {
    strict: true,
    versionKey: false
});

const Product = model<IProduct>(DATABASES.PRODUCT, productSchema, DATABASES.PRODUCT);
export default Product;