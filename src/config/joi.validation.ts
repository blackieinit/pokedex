import * as Joi from 'joi'

export const JoiValidationSchema = Joi.object({
    MONGODB_SERVER: Joi.required(),
    PORT_APP: Joi.number().default(3005),
    DEFAULT_LIMIT: Joi.number().default(6)
})