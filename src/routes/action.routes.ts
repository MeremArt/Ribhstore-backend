import { Request, Response, Router } from "express";
import ActionController from '../controllers/action.controllers';
import { createActionHeaders } from "@solana/actions";
const router = Router();
const {
    getAction,
    postAction
} = new ActionController();

//get action
router.get("/:name", getAction);

//options action
router.options("/:name", (_req: Request, res: Response) => {
    const headers = createActionHeaders();
    res.set(headers);
    return res;
});

//post action
router.post("/:name", postAction);

export default router;