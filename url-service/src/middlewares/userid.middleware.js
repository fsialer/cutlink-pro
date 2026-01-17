const userIdMiddleware = (req, res, next) => {
    const userId = req.headers['x-user-id']
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: Missing User ID' })
    }

    req.body = req.body || {}
    req.body.owner_id = userId
    req.owner_id = userId
    next()
}

export default userIdMiddleware