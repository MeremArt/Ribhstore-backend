import { Request, Response, NextFunction } from "express";
import logger from "./logger.middleware";
import CustomResponse from "../utils/helpers/response.util";

import { INTERNAL_SERVER_ERROR } from "../utils/statusCodes.util";

export default (error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(error);

  return new CustomResponse(INTERNAL_SERVER_ERROR, false, error.message, res);
};