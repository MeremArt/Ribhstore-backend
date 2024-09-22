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
        default: null,
        trim: true,
        sparse: true,
        unique: true
    },
    pubKey: {
        type: String,
        required: false,
        default: null,
        sparse: true,
        trim: true,
        unique: true
    },
    hasAccess: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    strict: true,
    versionKey: false
});

const User = model<IUser>(DATABASES.USER, userSchema, DATABASES.USER);
export default User;