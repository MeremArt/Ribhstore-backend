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
import store from 'session-file-store';

const FileStore = store(session);

export default (app: Application) => {

  app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      // Optional configurations for file-store
      path: './sessions',  // Path to save session files
      ttl: 3600,  // Time to live for session files in seconds
    })
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