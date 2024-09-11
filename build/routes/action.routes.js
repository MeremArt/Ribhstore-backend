"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const action_controllers_1 = __importDefault(require("../controllers/action.controllers"));
const constants_config_1 = require("../configs/constants.config");
const router = (0, express_1.Router)();
const { getAction, postAction } = new action_controllers_1.default();
//get action
router.get("/:name", getAction);
router.options("/:name", (_req, res) => {
    res.set(constants_config_1.ACTIONS_CORS_HEADERS).send();
});
//post action
router.post("/:name", postAction);
exports.default = router;
