const urlService = require('./url.service')
const catchAsync = require('../../utils/catchAsync')

module.exports = {
    getAllUrls: catchAsync(getAllUrls),
    createUrl: catchAsync(createUrl),
    deleteUrl: catchAsync(deleteUrl),
    incrClick: catchAsync(incrClick),
    getPublicUrl: catchAsync(getPublicUrl)
}

async function getAllUrls(req, res) {
    const owner_id = req.owner_id
    const result = await urlService.getAllUrls(owner_id);
    res.status(200).json(result);
}

async function createUrl(req, res) {
    const url = req.body
    url.owner_id = req.owner_id
    const result = await urlService.createUrl(url)
    if (result.short_code) {
        res.status(201).json(result)
    } else {
        res.status(400).json({ 'message': 'URL not created' })
    }
}

async function deleteUrl(req, res) {
    const { url_id } = req.params
    const owner_id = req.owner_id
    await urlService.deleteUrl(url_id, owner_id)
    res.status(204).end()
}

async function incrClick(req, res) {
    const { short_code } = req.params
    const result = await urlService.getPublicUrl(short_code)
    const { owner_id, clicks } = result
    urlService.incrementClick(short_code, owner_id, clicks)
    res.status(204).end()
}

async function getPublicUrl(req, res) {
    const { short_code } = req.params
    const result = await urlService.getPublicUrl(short_code)
    res.status(200).json(result)
}