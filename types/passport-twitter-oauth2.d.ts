// types/passport-twitter-oauth2.d.ts
declare module 'passport-twitter-oauth2' {
    import { Strategy as PassportStrategy } from 'passport';

    interface StrategyOptions {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
    }

    interface VerifyFunction {
        (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void): void;
    }

    export class Strategy extends PassportStrategy {
        constructor(options: StrategyOptions, verify: VerifyFunction);
    }
}
