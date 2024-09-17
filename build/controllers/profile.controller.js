"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_twitter_1 = require("passport-twitter");
const user_service_1 = __importDefault(require("../services/user.service"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const axios_1 = __importDefault(require("axios"));
const httpException_util_1 = __importDefault(require("../utils/helpers/httpException.util"));
const response_util_1 = __importDefault(require("../utils/helpers/response.util"));
const statusCodes_util_1 = require("../utils/statusCodes.util");
const constants_config_1 = require("../configs/constants.config");
const { CREATED, FETCHED, UPDATED, NO_QUERY, USER_NOT_FOUND } = constants_config_1.MESSAGES.USER;
const { UNEXPECTED_ERROR } = constants_config_1.MESSAGES;
const { create, findById, findByQuery } = new user_service_1.default();
const router = express_1.default.Router();
passport_1.default.use(new passport_twitter_1.Strategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY1,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET1,
    callbackURL: "https://ribh-store.vercel.app/api/v1/auth/twitter/callback",
}, (token, tokenSecret, profile, done) => {
    const userProfile = {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        photos: profile.photos ? profile.photos.map(photo => photo.value) : []
    };
    return done(null, userProfile);
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((obj, done) => {
    done(null, obj);
});
// Initiate authentication with Twitter
router.get('/auth/twitter', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.query.email;
    if (!userEmail) {
        return res.status(400).json({ error: 'Email is required' });
    }
    const existingUser = yield findByQuery({ email: userEmail });
    if (!existingUser) {
        return next(new Error('Email not whitelisted'));
    }
    // Store the email in the session
    // req.session.userEmail = userEmail as string;
    console.log('Email stored', userEmail);
    req.email = userEmail;
    // res.redirect(`http://localhost:9871/api/v1/auth/twitter/auth/twitter?state=${userEmail}`);
    // Continue with Twitter OAuth
    passport_1.default.authenticate('twitter', { state: "userrrrr" })(req, res, next);
}));
// Handle Twitter OAuth callback
router.get('/auth/twitter/callback', passport_1.default.authenticate('twitter', { failureRedirect: '/' }), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
// create profile
router.post('/auth/whitelist', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emails = req.body.emails;
        const whitelistedUsers = yield Promise.all(emails.map((email) => __awaiter(void 0, void 0, void 0, function* () {
            // Check if the user is already whitelisted or create a new record
            let user = yield findByQuery({ email });
            if (!user) {
                user = yield create({ email });
            }
            return user;
        })));
        return new response_util_1.default(statusCodes_util_1.ADDED, true, CREATED, res, whitelistedUsers);
    }
    catch (error) {
        if (error instanceof httpException_util_1.default) {
            return new response_util_1.default(error.status, false, error.message, res);
        }
        return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error}`, res);
    }
}));
// connect wallet
router.patch('/auth/connectWallet', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        if (!email) {
            throw new Error("QUERY is required");
        }
        const user = yield findByQuery({ email });
        if (user) {
            user.pubKey = req.body.pubKey;
            yield user.save();
        }
        else {
            return next(new Error('Email not whitelisted'));
        }
        return new response_util_1.default(statusCodes_util_1.OK, true, UPDATED, res, user);
    }
    catch (error) {
        if (error instanceof httpException_util_1.default) {
            return new response_util_1.default(error.status, false, error.message, res);
        }
        return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error}`, res);
    }
}));
// Fetch user information from twitter account
router.get('/user/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield findById(req.params.id);
        if (!user) {
            throw new httpException_util_1.default(statusCodes_util_1.NOT_FOUND, USER_NOT_FOUND);
        }
        if (!user.twitterId) {
            throw new httpException_util_1.default(statusCodes_util_1.NOT_FOUND, "Please connect twitter account");
        }
        const url = `https://api.twitter.com/2/users/${user.twitterId}?user.fields=username,profile_image_url,description`;
        // Use your bearer token for authentication
        const response = yield axios_1.default.get(url, {
            headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
            }
        });
        // Return the latest Twitter profile data
        return new response_util_1.default(statusCodes_util_1.OK, true, UPDATED, res, response.data);
    }
    catch (error) {
        if (error instanceof httpException_util_1.default) {
            return new response_util_1.default(error.status, false, error.message, res);
        }
        return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error}`, res);
    }
}));
// Verify user email
router.get('/user', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        if (!email) {
            throw new Error("QUERY is required");
        }
        const user = yield findByQuery({ email });
        if (user) {
            return new response_util_1.default(statusCodes_util_1.OK, true, "Email is whitelisted", res, user);
        }
        else {
            throw new httpException_util_1.default(statusCodes_util_1.NOT_FOUND, USER_NOT_FOUND);
        }
    }
    catch (error) {
        if (error instanceof httpException_util_1.default) {
            return new response_util_1.default(error.status, false, error.message, res);
        }
        return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `${UNEXPECTED_ERROR}: ${error}`, res);
    }
}));
exports.default = router;
