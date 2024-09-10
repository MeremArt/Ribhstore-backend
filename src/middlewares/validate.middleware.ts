import { NextFunction, Request, RequestHandler, Response } from "express";
import Joi from "joi";
import { FORBIDDEN } from "../utils/statusCodes.util";
import CustomResponse from "../utils/helpers/response.util";

function validate(schema: Joi.ObjectSchema<any>): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction) {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false
        });
        if (error) {
            let errorMessage: string[] = [];
            error.details.forEach(detail => {
                errorMessage.push(detail.message);
            });
            return new CustomResponse(FORBIDDEN, false, errorMessage, res);
        }
        req.body = value;
        next();
    }
}

export default validate;