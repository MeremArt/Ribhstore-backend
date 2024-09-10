import { Document } from 'mongoose';

export default interface IProduct extends Document {
    merchantId: string;
    name: string;
    image: string;
    description: string;
    price: number;
}