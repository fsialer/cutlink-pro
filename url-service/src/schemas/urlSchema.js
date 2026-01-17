import joi from '@hapi/joi'
const idSchema = joi.number()

const urlUrlSchema = joi.string().uri({ scheme: ["http", "https"] })


const urlISchema = {
    url_id: idSchema.required()
}

const createUrlSchema = {
    long_url: urlUrlSchema.required(),
    short_code: joi.string(),
    owner_id: joi.string(),
    expiration_hours: joi.number().default(0)
}

const updateeUrlSchema = {
    long_url: urlUrlSchema.required(),
    expiration_hours: joi.number().default(0)
}

export {
    urlISchema,
    createUrlSchema,
    updateeUrlSchema
}


