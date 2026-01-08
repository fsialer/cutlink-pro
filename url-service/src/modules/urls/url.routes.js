const express = require('express')
const router = express.Router();
const { getAllUrls, createUrl, getUrl, updateUrl, deleteUrl, incrClick, getPublicUrl } = require('./url.controller')
const obtainUserIdMiddleware = require('../../middlewares/obtainUserIdMiddleware')
const validation = require('../../middlewares/createValidationMiddleware');
const { createUrlSchema, urlISchema, updateeUrlSchema } = require('../../schemas/urlSchema');

router.get('/public/:short_code', getPublicUrl)
router.post('/public/:short_code/click', incrClick)
router.get('/', obtainUserIdMiddleware(), getAllUrls)
router.post('/', obtainUserIdMiddleware(), validation({ body: createUrlSchema }), createUrl)
router.get('/:url_id', obtainUserIdMiddleware(), validation({ params: urlISchema }), getUrl)
router.put('/:url_id', obtainUserIdMiddleware(), validation({ params: urlISchema, body: updateeUrlSchema }), updateUrl)
router.patch('/:url_id', obtainUserIdMiddleware(), validation({ params: urlISchema, body: updateeUrlSchema }), updateUrl)
router.delete('/:url_id', obtainUserIdMiddleware(), validation({ params: urlISchema }), deleteUrl)


module.exports = router