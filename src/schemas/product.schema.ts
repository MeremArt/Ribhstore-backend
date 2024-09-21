import Joi from "joi";

const createSchema = Joi.object({
    merchantId: Joi.string().required(),
    name: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    amount: Joi.number().required()
});

export {
    createSchema
}