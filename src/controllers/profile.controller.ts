import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as TwitterStrategy, Profile } from 'passport-twitter';
import UserService from "../services/user.service";
import IUser from '../interfaces/user.interface';
import { configDotenv } from 'dotenv';
configDotenv();
import axios from 'axios';
import HttpException from '../utils/helpers/httpException.util';
import CustomResponse from "../utils/helpers/response.util";
import { ADDED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from '../utils/statusCodes.util';
import { MESSAGES } from "../configs/constants.config";
import session from 'express-session';
import { Client } from "twitter-api-sdk";
import { TwitterApi } from 'twitter-api-v2';
const {
    CREATED,
    FETCHED,
    UPDATED,
    NO_QUERY,
    USER_NOT_FOUND
} = MESSAGES.USER;
const {
    UNEXPECTED_ERROR
} = MESSAGES;
const {
    create,
    findById,
    findByQuery
} = new UserService();
const router = express.Router();

const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY1 as string,
    appSecret: process.env.TWITTER_CONSUMER_SECRET1 as string,
    accessToken: "937750514049142784-uAzaI3PR6c80Rjm5MIW2pWxr2Uf7nVn" as string, // You can use OAuth token for authenticated user
    accessSecret: "HGbPKbGfWuufpfAIzthxjEsVxGfWKKa6T5vh43mDYSK0I" as string
});

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY1 as string,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET1 as string,
    callbackURL: "https://ribh-store.vercel.app/api/v1/auth/twitter/callback",
},
    (token: string, tokenSecret: string, profile: Profile, done: (error: any, user?: Express.User | false) => void) => {

        const userProfile = {
            id: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            photos: profile.photos ? profile.photos.map(photo => photo.value) : []
        };

        return done(null, userProfile);
    }
));
passport.serializeUser((user: any, done: any) => {
    done(null, user);
});

passport.deserializeUser((obj: any, done: any) => {
    done(null, obj);
});

// Initiate authentication with Twitter
router.get('/auth/twitter', async (req: Request, res: Response, next: NextFunction) => {
    const userEmail = req.query.email;
    if (!userEmail) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const existingUser = await findByQuery({ email: userEmail });
    if (!existingUser) {
        return next(new Error('Email not whitelisted'));
    }

    // Continue with Twitter OAuth
    passport.authenticate('twitter')(req, res, next);
});

// Handle Twitter OAuth callback
router.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/' }),
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new Error('User not authenticated'));
        }

        // Find the user in the DB based on email and save Twitter profile info
        // const existingUser = await findByQuery({ email });
        // if (existingUser) {
        //     existingUser.twitterId = (req as any).user.id;
        //     await existingUser.save();
        // } else {
        //     return next(new Error('Email not whitelisted'));
        // }

        // Respond with user information (assuming `req.user` has the necessary fields)
        // res.json(req.user);
        res.redirect(`https://www.ribh.store/verify-email/connect-accounts?twitterId=${(req as any).user.id}`);
        // res.redirect(`http://localhost:3000/verify-email/connect-accounts?twitterId=${(req as any).user.id}`);
    }
);

// create profile
router.post('/auth/whitelist', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const emails: string[] = req.body.emails
        const whitelistedUsers = await Promise.all(

            emails.map(async (email: string) => {

                // Check if the user is already whitelisted or create a new record
                let user = await findByQuery({ email });

                if (!user) {
                    user = await create({ email });
                }

                return user;
            })
        );

        return new CustomResponse(ADDED, true, CREATED, res, whitelistedUsers);

    } catch (error) {

        if (error instanceof HttpException) {

            return new CustomResponse(error.status, false, error.message, res);

        }
        return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error}`, res);
    }
});

// connect wallet
router.patch('/auth/connect-wallet', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.query.email;
        if (!email) {
            throw new Error("QUERY is required");
        }

        const user = await findByQuery({ email });
        if (user) {
            user.pubKey = req.body.pubKey;
            await user.save();
        } else {
            return next(new Error('Email not whitelisted'));
        }

        return new CustomResponse(OK, true, UPDATED, res, user);

    } catch (error) {

        if (error instanceof HttpException) {

            return new CustomResponse(error.status, false, error.message, res);

        }
        return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error}`, res);
    }

});

// connect twitterId
router.patch('/auth/connect-twitter', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { twitterId, email } = req.query;
        if (!twitterId || !email) {
            throw new Error("QUERY of twitterId and email is required");
        }

        const user = await findByQuery({ email });
        if (user) {
            user.twitterId = twitterId as string;
            await user.save();
        } else {
            return next(new Error('Email not whitelisted'));
        }

        return new CustomResponse(OK, true, UPDATED, res, user);

    } catch (error) {

        if (error instanceof HttpException) {

            return new CustomResponse(error.status, false, error.message, res);

        }
        return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error}`, res);
    }

});

// Fetch user information from twitter account
router.get('/user/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await findById(req.params.id);
        if (!user) {
            throw new HttpException(NOT_FOUND, USER_NOT_FOUND);
        }

        if (!user.twitterId) {
            throw new HttpException(NOT_FOUND, "Please connect twitter account");
        }

        const userInfo = await twitterClient.currentUserV2()

        if (!userInfo) {
            res.redirect("https://www.ribh.store/verify-email/connect-accounts")
            // res.redirect("http://localhost:3000/verify-email/connect-accounts")
        }

        const data = await twitterClient.v2.userByUsername(userInfo.data.username, {
            'user.fields': ['profile_image_url', 'username', 'name']
        });

        // Return the latest Twitter profile data
        return new CustomResponse(OK, true, FETCHED, res, data.data);

    } catch (error: any) {

        if (error instanceof HttpException) {

            return new CustomResponse(error.status, false, error.message, res);

        }
        return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error.message}`, res);
    }

});

// Verify user email
router.get('/user', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const email = req.query.email;
        if (!email) {
            throw new Error("QUERY is required");
        }

        const user = await findByQuery({ email });
        if (user) {
            return new CustomResponse(OK, true, "Email is whitelisted", res, user);
        } else {
            throw new HttpException(NOT_FOUND, USER_NOT_FOUND);
        }

    } catch (error) {

        if (error instanceof HttpException) {

            return new CustomResponse(error.status, false, error.message, res);

        }
        return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error}`, res);
    }

});

export default router;