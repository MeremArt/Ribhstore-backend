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
        trim: true
    },
    pubKey: {
        type: String,
        required: false,
        default: null,
        trim: true
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

// Adding sparse unique indexes for `twitterId` and `pubKey`
userSchema.index({ twitterId: 1 }, { unique: true, sparse: true });
userSchema.index({ pubKey: 1 }, { unique: true, sparse: true });

const User = model<IUser>(DATABASES.USER, userSchema, DATABASES.USER);
export default User;