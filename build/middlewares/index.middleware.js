"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const errors_middleware_1 = __importDefault(require("./errors.middleware"));
const index_route_1 = __importDefault(require("../routes/index.route"));
const action_routes_1 = __importDefault(require("../routes/action.routes"));
const constants_config_1 = require("../configs/constants.config");
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const session_file_store_1 = __importDefault(require("session-file-store"));
const FileStore = (0, session_file_store_1.default)(express_session_1.default);
exports.default = (app) => {
    app.use((0, express_session_1.default)({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            // Optional configurations for file-store
            path: './sessions', // Path to save session files
            ttl: 3600, // Time to live for session files in seconds
        })
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    passport_1.default.serializeUser((user, done) => {
        done(null, user);
    });
    passport_1.default.deserializeUser((obj, done) => {
        done(null, obj);
    });
    // Logging middleware
    app.use((0, morgan_1.default)("combined"));
    // CORS middleware
    app.options("*", (0, cors_1.default)());
    app.use((0, cors_1.default)({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS"],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    // Configuration setup (dotenv)
    if (process.env.NODE_ENV !== 'production')
        (0, dotenv_1.configDotenv)();
    // Body parsing middleware
    app.use((0, express_1.json)());
    app.use((0, express_1.urlencoded)({ extended: true }));
    // Security middleware
    app.use((0, helmet_1.default)());
    // Custom error handling middleware
    app.use(errors_middleware_1.default);
    // Action routes
    app.use("/", action_routes_1.default);
    // Mounting routes
    app.use(constants_config_1.BASEPATH, index_route_1.default);
};
