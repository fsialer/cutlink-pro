import express from 'express'
const router = express.Router();
import { getAllUrls, createUrl, deleteUrl, incrClick, getPublicUrl } from './url.controller.js'
import userIdMiddleware from '../../middlewares/userid.middleware.js'
import validation from '../../middlewares/createvalidation.middleware.js';

import { createUrlSchema, urlISchema } from '../../schemas/urlSchema.js';


router.get('/public/:short_code', getPublicUrl)
router.post('/public/:short_code/click', incrClick)
router.get('/', userIdMiddleware, getAllUrls)
router.post('/', userIdMiddleware, validation({ body: createUrlSchema }), createUrl)
router.delete('/:url_id', userIdMiddleware, validation({ params: urlISchema }), deleteUrl)

export default router