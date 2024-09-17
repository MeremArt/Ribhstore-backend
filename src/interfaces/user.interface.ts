import { Document } from 'mongoose';

export default interface IUser extends Document {
    email: string;
    twitterId?: string;
    pubKey?: string;
}