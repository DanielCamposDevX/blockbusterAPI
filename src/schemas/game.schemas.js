import Joi from "joi";


export const gameschema = Joi.object({
    name: Joi.string().required(),
    stockTotal: Joi.number().positive(),
    image: Joi.string().required(),
    pricePerDay:Joi.number().required()
})