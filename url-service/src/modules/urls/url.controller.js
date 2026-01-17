import urlService from './url.service.js'
import catchAsync from '../../utils/catchAsync.js'

export const getAllUrls = catchAsync(async (req, res) => {
    const owner_id = req.owner_id
    const result = await urlService.getAllUrls(owner_id);
    res.status(200).json(result);
});

export const createUrl = catchAsync(async (req, res) => {
    const url = req.body
    url.owner_id = req.owner_id
    const result = await urlService.createUrl(url)
    if (result.short_code) {
        res.status(201).json(result)
    } else {
        res.status(400).json({ 'message': 'URL not created' })
    }
});

export const deleteUrl = catchAsync(async (req, res) => {
    const { url_id } = req.params
    const owner_id = req.owner_id
    await urlService.deleteUrl(url_id, owner_id)
    res.status(204).end()
});

export const incrClick = catchAsync(async (req, res) => {
    const { short_code } = req.params
    const result = await urlService.getPublicUrl(short_code)
    const { owner_id, clicks } = result
    urlService.incrementClick(short_code, owner_id, clicks)
    res.status(204).end()
});

export const getPublicUrl = catchAsync(async (req, res) => {
    const { short_code } = req.params
    const result = await urlService.getPublicUrl(short_code)
    res.status(200).json(result)
});