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

    // Store the email in the session
    // req.session.userEmail = userEmail as string;
    console.log('Email stored', userEmail);

    (req as any).email = userEmail;

    // res.redirect(`http://localhost:9871/api/v1/auth/twitter/auth/twitter?state=${userEmail}`);
    // Continue with Twitter OAuth
    passport.authenticate('twitter', { state: "userrrrr" })(req, res, next);
});

// Handle Twitter OAuth callback
router.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/' }),
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new Error('User not authenticated'));
        }

        // const userEmail = (req as any).email;
        // console.log(req.query.state, "state")
        // console.log(userEmail, "req")
        // const email = req.query.state as string;
        // if (!email) {
        //     return next(new Error('User email not found in session'));
        // }

        // Find the user in the DB based on email and save Twitter profile info
        // const existingUser = await findByQuery({ email });
        // if (existingUser) {
        //     existingUser.twitterId = (req as any).user.id;
        //     await existingUser.save();
        // } else {
        //     return next(new Error('Email not whitelisted'));
        // }

        // Respond with user information (assuming `req.user` has the necessary fields)
        return res.json(req.user); // In a real app, consider defining a User type and using `req.user as User`.
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
router.patch('/auth/connectWallet', async (req: Request, res: Response, next: NextFunction) => {
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
        const url = `https://api.twitter.com/2/users/${user.twitterId}?user.fields=username,profile_image_url,description`;

        // Use your bearer token for authentication
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
            }
        });

        // Return the latest Twitter profile data
        return new CustomResponse(OK, true, UPDATED, res, response.data);

    } catch (error) {

        if (error instanceof HttpException) {

            return new CustomResponse(error.status, false, error.message, res);

        }
        return new CustomResponse(INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error}`, res);
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