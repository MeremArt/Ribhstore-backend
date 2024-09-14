import { Router, Request, Response } from 'express';
import productRoute from "./product.route";
import transactionRoute from "./transaction.routes";
import { OK } from '../utils/statusCodes.util';
const router: Router = Router();
import CustomResponse from "../utils/helpers/response.util";

/**API base route */
router.get("/", (req: Request, res: Response) => {
    return new CustomResponse(OK, true, "Welcome to RibhStore API ensure to go through the API docs before using this service", res);
});

router.use("/product", productRoute);
router.use("/transaction", transactionRoute);

export default router;