"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const action_controllers_1 = __importDefault(require("../controllers/action.controllers"));
const actions_1 = require("@solana/actions");
const router = (0, express_1.Router)();
const { getAction, postAction } = new action_controllers_1.default();
//get action
router.get("/:name", getAction);
//options action
router.options("/:name", (_req, res) => {
    const headers = (0, actions_1.createActionHeaders)();
    res.set(headers);
    return res.json();
});
//post action
router.post("/:name", postAction);
exports.default = router;
