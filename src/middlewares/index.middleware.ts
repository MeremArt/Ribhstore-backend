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
    saveUninitialized: false
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
  app.options("*", cors());
  app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

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