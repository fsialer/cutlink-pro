const urlService = require('./url.service')

module.exports = {
    getAllUrls,
    createUrl,
    getUrl,
    updateUrl,
    deleteUrl,
    incrClick,
    getPublicUrl
}

async function getAllUrls(req, res) {
    try {
        const owner_id = req.owner_id
        const result = await urlService.getAllUrls(owner_id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

async function createUrl(req, res) {
    try {
        const url = req.body
        url.owner_id = req.owner_id
        const result = await urlService.createUrl(url)
        if (result.short_code) {
            res.status(201).json(result)
        } else {
            res.status(400).json({ 'message': 'URL not created' })
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

async function getUrl(req, res) {
    try {
        const urlId = req.params.urlId
        const owner_id = req.owner_id
        const result = await urlService.getUrl(urlId, owner_id)
        res.status(200).json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

async function updateUrl(req, res) {
    try {
        const { urlId } = req.params
        const url = req.body
        const owner_id = req.owner_id
        const result = await urlService.updateUrl(urlId, url, owner_id)
        res.status(200).json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

async function deleteUrl(req, res) {
    try {
        const { url_id } = req.params
        const owner_id = req.owner_id
        const result = await urlService.deleteUrl(url_id, owner_id)
        res.status(204).end()
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

async function incrClick(req, res) {
    try {
        const { short_code } = req.params
        const result = await urlService.getPublicUrl(short_code)
        const { owner_id, clicks } = result
        urlService.incrementClick(short_code, owner_id, clicks)
        res.status(204).end()
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

async function getPublicUrl(req, res) {
    try {
        const { short_code } = req.params
        const result = await urlService.getPublicUrl(short_code)
        res.status(200).json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}