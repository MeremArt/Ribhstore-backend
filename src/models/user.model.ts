import { model, Schema } from "mongoose";
import IUser from "../interfaces/user.interface";
import { DATABASES } from "../configs/constants.config";

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    twitterId: {
        type: String,
        required: false,
        trim: true,
        unique: true
    },
    pubKey: {
        type: String,
        required: false,
        trim: true,
        unique: true
    }
}, {
    strict: true,
    versionKey: false
});

const User = model<IUser>(DATABASES.USER, userSchema, DATABASES.USER);
export default User;