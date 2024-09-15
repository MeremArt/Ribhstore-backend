import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import Twitter from 'passport-twitter-oauth2';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

const TwitterStrategy = Twitter.Strategy;
const router = express.Router();

interface TwitterProfile {
    id: string;
    username: string;
    displayName: string;
    photos: { value: string }[];
}

passport.use(new TwitterStrategy({
    clientID: process.env.TWITTER_CONSUMER_KEY as string,
    clientSecret: process.env.TWITTER_CONSUMER_SECRET as string,
    callbackURL: "https://ribh-store.vercel.app/api/v1/auth/twitter/callback"
},
    (token: string, tokenSecret: string, profile: TwitterProfile, done: (error: any, user?: Express.User | false) => void) => {
        console.log("Token:", token);
        console.log("TokenSecret:", tokenSecret);
        console.log("Profile:", profile);

        // In a real-world app, you'd save the profile info to your database here
        return done(null, profile);
    }
));

// Initiate authentication with Twitter
router.get('/auth/twitter', passport.authenticate('twitter'));

// Handle Twitter OAuth callback
router.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/' }),
    (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new Error('User not authenticated'));
        }
        // Respond with user information (assuming `req.user` has the necessary fields)
        return res.json(req.user); // In a real app, consider defining a User type and using `req.user as User`.
    }
);

export default router;

// import axios from 'axios';
// import express, { Request, Response } from 'express';
// import OAuth from 'oauth-1.0a';
// import crypto from 'crypto';
// import oauthSignature from 'oauth-signature';
// import { v4 as uuidv4 } from 'uuid';
// const router = express.Router();

// // Your Twitter app credentials
// const oauth = new OAuth({
//     consumer: {
//         key: 'your_consumer_key',
//         secret: 'your_consumer_secret',
//     },
//     signature_method: 'HMAC-SHA1',
//     hash_function(baseString: string, key: string) {
//         return crypto.createHmac('sha1', key).update(baseString).digest('base64');
//     }
// });

// // Request Token Endpoint
// router.get('/auth/twitter', async (req: Request, res: Response) => {

//     const oauthCallback = 'http://localhost/sign-in-with-twitter';
//     const oauthConsumerKey = process.env.TWITTER_CONSUMER_KEY;
//     const oauthConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
//     const oauthNonce = uuidv4().replace(/-/g, '');
//     const oauthTimestamp = Math.floor(Date.now() / 1000);
//     const oauthSignatureMethod = 'HMAC-SHA1';
//     const oauthVersion = '1.0';

//     const httpMethod = 'POST';
//     const url = 'https://api.x.com/oauth/request_token';

//     // Base parameters for signature
//     const parameters = {
//         oauth_callback: oauthCallback,
//         oauth_consumer_key: oauthConsumerKey,
//         oauth_nonce: oauthNonce,
//         oauth_signature_method: oauthSignatureMethod,
//         oauth_timestamp: oauthTimestamp,
//         oauth_version: oauthVersion
//     };

//     // Generate the signature
//     const signature = oauthSignature.generate(httpMethod, url, parameters, oauthConsumerSecret!);

//     // Construct the Authorization header
//     const authHeader = `OAuth oauth_callback="${encodeURIComponent(oauthCallback)}", oauth_consumer_key="${oauthConsumerKey}", oauth_nonce="${oauthNonce}", oauth_signature="${encodeURIComponent(signature)}", oauth_signature_method="${oauthSignatureMethod}", oauth_timestamp="${oauthTimestamp}", oauth_version="${oauthVersion}"`;

//     try {
//         const response = await axios.post(url, null, {
//             headers: {
//                 Authorization: authHeader,
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 'User-Agent': 'YourAppName/1.0'
//             }
//         });

//         return res.status(200).json(response.data)

//     } catch (error) {
//         res.send(error);
//     }
// });

// // Callback Endpoint
// router.get('/auth/twitter/callback', async (req: Request, res: Response) => {
//     const requestTokenUrl = 'https://api.twitter.com/oauth/access_token';
//     const { oauth_token, oauth_verifier } = req.query;

//     const token = {
//         key: oauth_token as string,
//         secret: 'request_token_secret', // Store the request token secret from the initial request
//     };

//     const accessTokens = oauth.authorize({
//         url: requestTokenUrl,
//         method: 'POST',
//         data: {
//             oauth_verifier: oauth_verifier as string,
//         },
//     }, token);

//     try {
//         const response = await axios.post(requestTokenUrl, null, {
//             headers: {
//                 Authorization: oauth.toHeader(accessTokens).Authorization,
//             },
//         });

//         const data = new URLSearchParams(response.data);
//         const accessToken = data.get('oauth_token');
//         const accessTokenSecret = data.get('oauth_token_secret');
//         const userId = data.get('user_id');
//         const screenName = data.get('screen_name');
//         res.send(`Access Token: ${accessToken}, Secret: ${accessTokenSecret}, User ID: ${userId}, Screen Name: ${screenName}`);
//     } catch (error) {
//         res.send(error);
//     }
// });

// export default router;



// // import express, { Request, Response } from 'express';
// // import crypto from 'crypto';
// // import Oauth1a from 'oauth-1.0a';
// // import axios from 'axios'; // Import axios
// // import { URLSearchParams } from 'url';
// // import UserModel from '../models/user.model';

// // const router = express.Router();

// // // Initialize OAuth 1.0a instance
// // const oauth = new Oauth1a({
// //     consumer: {
// //         key: process.env.CONSUMER_KEY || '',
// //         secret: process.env.CONSUMER_SECRET || ''
// //     },
// //     signature_method: 'HMAC-SHA1',
// //     hash_function: (baseString: string, key: string) =>
// //         crypto.createHmac('sha1', key).update(baseString).digest('base64')
// // });

// // /**
// //  * Function to request an OAuth token from Twitter
// //  * @returns {Promise<{ oauth_token: string; oauth_token_secret: string }>}
// //  */
// // async function requestToken(): Promise<{ oauth_token: string; oauth_token_secret: string }> {
// //     const requestTokenURL = 'https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write';
// //     const authHeader = oauth.toHeader(oauth.authorize({
// //         url: requestTokenURL,
// //         method: 'POST'
// //     }));

// //     try {
// //         const response = await axios.post(requestTokenURL, null, {
// //             headers: {
// //                 'Authorization': authHeader['Authorization'],
// //                 'Content-Type': 'application/x-www-form-urlencoded'
// //             }
// //         });

// //         const body = response.data;
// //         console.log('Request Token Response:', body);

// //         return Object.fromEntries(new URLSearchParams(body)) as { oauth_token: string; oauth_token_secret: string };
// //     } catch (error) {
// //         console.error('Error requesting token:', error);
// //         throw new Error('Failed to request token');
// //     }
// // }

// // /**
// //  * Function to exchange the verifier and request token for an access token
// //  * @param {{ oauth_token: string; oauth_token_secret: string }} tokenData
// //  * @param {string} verifier
// //  * @returns {Promise<{ oauth_token: string; oauth_token_secret: string; user_id: string; screen_name: string }>}
// //  */
// // async function accessTokens(tokenData: any, verifier: string): Promise<{ oauth_token: string; oauth_token_secret: string; user_id: string; screen_name: string }> {
// //     const url = `https://api.twitter.com/oauth/access_token`;
// //     const authHeader = oauth.toHeader(oauth.authorize({
// //         url,
// //         method: 'POST'
// //     }, tokenData));

// //     try {
// //         const response = await axios.post(url, new URLSearchParams({
// //             oauth_verifier: verifier,
// //             oauth_token: tokenData.oauth_token
// //         }).toString(), {
// //             headers: {
// //                 'Authorization': authHeader['Authorization'],
// //                 'Content-Type': 'application/x-www-form-urlencoded'
// //             }
// //         });

// //         const body = response.data;
// //         console.log('Access Token Response:', body);

// //         return Object.fromEntries(new URLSearchParams(body)) as { oauth_token: string; oauth_token_secret: string; user_id: string; screen_name: string };
// //     } catch (error) {
// //         console.error('Error exchanging token:', error);
// //         throw new Error('Failed to exchange token');
// //     }
// // }

// // async function fetchTwitterProfile(oauthToken: string, oauthTokenSecret: string): Promise<any> {
// //     const token = {
// //         key: oauthToken,
// //         secret: oauthTokenSecret
// //     };

// //     const url = 'https://api.twitter.com/2/account/verify_credentials.json'; // Adjusted for new API version
// //     const authHeader = oauth.toHeader(oauth.authorize({ url, method: 'GET' }, token));

// //     try {
// //         const response = await axios.get(url, {
// //             headers: {
// //                 'Authorization': authHeader['Authorization']
// //             }
// //         });

// //         return response.data;
// //     } catch (error) {
// //         console.error('Error fetching profile:', error);
// //         throw new Error('Failed to fetch Twitter profile');
// //     }
// // }

// // // Endpoint: Fetch Twitter profile details of the user
// // router.get('/twitter/profile', async (req: Request, res: Response) => {
// //     try {
// //         const { userId } = req.query; // Assumes userId is passed in query params

// //         // Find user from DB
// //         const user = await UserModel.findOne({ userId });
// //         if (!user) {
// //             return res.status(404).json({ error: 'User not found' });
// //         }

// //         // Fetch the user's profile from Twitter
// //         const profile = await fetchTwitterProfile(user.oauthToken, user.oauthTokenSecret);

// //         // Return profile details
// //         res.json(profile);
// //     } catch (error) {
// //         console.error('Error fetching profile:', error);
// //         res.status(500).json({ error: 'Failed to fetch Twitter profile' });
// //     }
// // });

// // // Endpoint: Connect wallet
// // router.post('/wallet/profile', async (req: Request, res: Response) => {
// //     try {
// //         const { userId } = req.query;
// //         const { userAddress } = req.body;

// //         // Find user from DB
// //         const user = await UserModel.findOne({ userId });
// //         if (!user) {
// //             return res.status(404).json({ error: 'User not found' });
// //         }

// //         // Update the wallet address
// //         user.walletAddress = userAddress;
// //         await user.save();

// //         // Return updated user details
// //         res.json(user);
// //     } catch (error) {
// //         console.error('Error updating wallet address:', error);
// //         res.status(500).json({ error: 'Failed to update wallet address' });
// //     }
// // });

// // // Endpoint 1: Step 1: Get authorization URL
// // router.get('/twitter/auth-url', async (req: Request, res: Response) => {
// //     try {
// //         // Get the request token from Twitter
// //         const oAuthRequestToken = await requestToken();

// //         // Generate authorization URL
// //         const authorizeURL = `https://api.twitter.com/oauth/authorize?oauth_token=${oAuthRequestToken.oauth_token}`;
// //         return res.json({ url: authorizeURL });
// //     } catch (error: any) {
// //         console.error('Error:', error.message);
// //         res.status(500).json({ error: 'Failed to get authorization URL' });
// //     }
// // });

// // // Endpoint 2: Step 2: Callback to exchange verifier for access token
// // router.get('/twitter/callback', async (req: Request, res: Response) => {
// //     try {
// //         const oauthToken = req.query.oauth_token as string;
// //         const oauthVerifier = req.query.oauth_verifier as string;

// //         if (!oauthToken || !oauthVerifier) {
// //             return res.status(400).json({ error: 'Missing oauth_token or oauth_verifier' });
// //         }

// //         // Exchange verifier for access token
// //         const oAuthAccessToken = await accessTokens({
// //             oauth_token: oauthToken,
// //             oauth_token_secret: '' // OAuth token secret not needed here, can be an empty string or provided as needed
// //         }, oauthVerifier);

// //         // Extract user info from access token response
// //         const { oauth_token: accessToken, oauth_token_secret, user_id, screen_name } = oAuthAccessToken;

// //         // Save user data to DB
// //         await UserModel.create({
// //             userId: user_id,
// //             screenName: screen_name,
// //             oauthToken: accessToken,
// //             oauthTokenSecret: oauth_token_secret
// //         });

// //         // Respond with user info
// //         res.json({ user_id, screen_name, oauth_token: accessToken });
// //     } catch (error) {
// //         console.error('Error:', error);
// //         res.status(500).json({ error: 'Failed to handle callback' });
// //     }
// // });

// // export default router;
