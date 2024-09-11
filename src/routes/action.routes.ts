import { Request, Response, Router } from "express";
import ActionController from '../controllers/action.controllers';
import { ACTIONS_CORS_HEADERS } from "../configs/constants.config";
const router = Router();
const {
    getAction,
    postAction
} = new ActionController();

//get action
router.get("/:name", getAction);
router.options("/:name", (_req: Request, res: Response) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
        "Access-Control-Allow-Headers":
            "Content-Type, Authorization, Content-Encoding, Accept-Encoding"
    }).send();
    return res;
});

//post action
router.post("/:name", postAction);

export default router;