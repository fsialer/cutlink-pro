import joi from '@hapi/joi'

function validate(data, schema, options = {}) {
    const { error } = joi.object(schema).validate(data, options)
    return error;
}

export default validate