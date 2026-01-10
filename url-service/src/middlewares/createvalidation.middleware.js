const boom = require('@hapi/boom')
const validate = require('../utils/validate')

function createValidationMiddleware(validationSchema) {
    return function validationMiddleware(req, res, next) {
        for (const [key, schema] of Object.entries(validationSchema)) {
            if (['body', 'query', 'params'].includes(key)) {
                const error = validate(req[key], schema, { stripUnknown: true });
                if (error) {
                    return next(boom.badRequest(error));
                }
            }
        }
        next();
    }
}

module.exports = createValidationMiddleware

