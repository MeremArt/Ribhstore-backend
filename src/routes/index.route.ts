import { Router, Request, Response, Application } from 'express';
import productRoute from "./product.route";
import { OK } from '../utils/statusCodes.util';
const router: Router = Router();
import CustomResponse from "../utils/helpers/response.util";

/**API base route */
router.get("/", (req: Request, res: Response) => {
    return new CustomResponse(OK, true, "Welcome to RibhFinance API ensure to go through the API docs before using this service", res);
});

router.use("/product", productRoute);

export default router;