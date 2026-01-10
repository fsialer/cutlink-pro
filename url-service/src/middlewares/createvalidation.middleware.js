const boom = require('@hapi/boom')
const validate = require('../utils/validate')

function createValidationMiddleware(validationSchema) {
    const [[payloadKey, joiSchema]] = Object.entries(validationSchema)
    if (payloadKey !== 'body' && payloadKey !== 'query' && payloadKey !== 'params') {
        throw new Error('Invalid payload key')
    }

    return function validationMiddleware(req, res, next) {
        const payload = req[payloadKey]
        const error = validate(payload, joiSchema)
        error ? next(boom.badRequest(error)) : next()
    }
}

module.exports = createValidationMiddleware

