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
    res.set(ACTIONS_CORS_HEADERS).send();
});

//post action
router.post("/:name", postAction);

export default router;