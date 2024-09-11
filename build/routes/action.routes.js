"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const action_controllers_1 = __importDefault(require("../controllers/action.controllers"));
const router = (0, express_1.Router)();
const { getAction, postAction } = new action_controllers_1.default();
//get action
router.get("/:name", getAction);
router.options("/:name", (_req, res) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Encoding, Accept-Encoding"
    }).send();
    return res;
});
//post action
router.post("/:name", postAction);
exports.default = router;
