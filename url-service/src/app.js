const express = require('express')
const config = require('./config')
const urlRoute = require('./modules/urls/url.routes')
const secretMiddleware = require('./middlewares/secret.middleware')
const helmet = require('helmet')
const initDb = require('./scripts/urlTables')
const port = config.port

const app = express()

app.use(express.json())
app.use(helmet())

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use(secretMiddleware)
app.use(urlRoute)


initDb().then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`))
})