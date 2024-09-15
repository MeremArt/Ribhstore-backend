import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    userId: string;        // Twitter User ID
    walletAddress: string;
    screenName: string;    // Twitter Screen Name
    oauthToken: string;    // OAuth Token
    oauthTokenSecret: string; // OAuth Token Secret
}

const UserSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true },
    walletAddress: { type: String, required: false, unique: true },
    screenName: { type: String, required: true },
    oauthToken: { type: String, required: true },
    oauthTokenSecret: { type: String, required: true }
});

export default mongoose.model<IUser>('User', UserSchema);