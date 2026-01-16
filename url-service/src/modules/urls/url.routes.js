const express = require('express')
const router = express.Router();
const { getAllUrls, createUrl, getUrl, deleteUrl, incrClick, getPublicUrl } = require('./url.controller')
const userIdMiddleware = require('../../middlewares/userid.middleware')
const validation = require('../../middlewares/createvalidation.middleware');

const { createUrlSchema, urlISchema } = require('../../schemas/urlSchema');


router.get('/public/:short_code', getPublicUrl)
router.post('/public/:short_code/click', incrClick)
router.get('/', userIdMiddleware, getAllUrls)
router.post('/', userIdMiddleware, validation({ body: createUrlSchema }), createUrl)
router.delete('/:url_id', userIdMiddleware, validation({ params: urlISchema }), deleteUrl)

module.exports = router