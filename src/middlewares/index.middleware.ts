import { Application, json, urlencoded } from "express";
import { configDotenv } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import errorHandler from "./errors.middleware";
import indexRoutes from "../routes/index.route";
import actionRoutes from "../routes/action.routes";
import { BASEPATH } from "../configs/constants.config";
import session from 'express-session';
import passport from "passport";


export default (app: Application) => {

  app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  // Secure should be true in production with HTTPS
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: any, done: any) => {
    done(null, user);
  });

  passport.deserializeUser((obj: any, done: any) => {
    done(null, obj);
  });

  // Logging middleware
  app.use(morgan("combined"));

  // CORS middleware
  // const allowedOrigins = [
  //   'https://www.ribh.store',
  //   'http://localhost:3000',
  //   "https://dial.to"
  // ];
  
  // const corsOptions = {
  //   origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
  //     if (allowedOrigins.includes(origin!) || !origin) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error('Not allowed by CORS'), false);
  //     }
  //   },
  //   credentials: true,
  //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: [
  //     'Content-Type',
  //     'Authorization',
  //     'X-Requested-With',
  //     'Accept',
  //     'Origin'
  //   ]
  // };

  const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ]
  };  
  
  app.options('*', cors(corsOptions));
  app.use('*', cors(corsOptions));
  // Configuration setup (dotenv)
  if (process.env.NODE_ENV !== 'production') configDotenv();

  // Body parsing middleware
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // Security middleware
  app.use(helmet());

  // Custom error handling middleware
  app.use(errorHandler);

  // Action routes
  app.use("/", actionRoutes);

  // Mounting routes
  app.use(BASEPATH, indexRoutes);
};