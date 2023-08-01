import Joi from "joi";

const customDateFormat = Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const clientschema = Joi.object({
    name: Joi.string().min(1).required(),
    phone: Joi.string().min(10).max(11).required(),
    cpf: Joi.string().length(11).required(),
    birthday: customDateFormat.max(10).required()
})