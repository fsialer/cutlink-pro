const joi = require('@hapi/joi')

function validate(data, schema, options = {}) {
    const { error } = joi.object(schema).validate(data, options)
    return error;
}

module.exports = validate