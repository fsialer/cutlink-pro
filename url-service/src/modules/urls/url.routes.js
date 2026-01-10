const express = require('express')
const router = express.Router();
const { getAllUrls, createUrl, getUrl, updateUrl, deleteUrl, incrClick, getPublicUrl } = require('./url.controller')
const userIdMiddleware = require('../../middlewares/userid.middleware')
const validation = require('../../middlewares/createvalidation.middleware');

const { createUrlSchema, urlISchema, updateeUrlSchema } = require('../../schemas/urlSchema');


router.get('/public/:short_code', getPublicUrl)
router.post('/public/:short_code/click', incrClick)
router.get('/', userIdMiddleware, getAllUrls)
router.post('/', userIdMiddleware, validation({ body: createUrlSchema }), createUrl)
router.get('/:url_id', userIdMiddleware, validation({ params: urlISchema }), getUrl)
router.put('/:url_id', userIdMiddleware, validation({ params: urlISchema, body: updateeUrlSchema }), updateUrl)
router.patch('/:url_id', userIdMiddleware, validation({ params: urlISchema, body: updateeUrlSchema }), updateUrl)
router.delete('/:url_id', userIdMiddleware, validation({ params: urlISchema }), deleteUrl)


module.exports = router