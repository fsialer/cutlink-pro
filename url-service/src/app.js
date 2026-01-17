import express from 'express'
import config from './config/index.js'
import urlRoute from './modules/urls/url.routes.js'
import secretMiddleware from './middlewares/secret.middleware.js'
import errorMiddleware from './middlewares/error.middleware.js'
import helmet from 'helmet'
import initDb from './scripts/urlTables.js'
const port = config.port

const app = express()

app.use(express.json())
app.use(helmet())

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use(secretMiddleware)
app.use(urlRoute)

// Global Error Handler
app.use(errorMiddleware)


initDb().then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`))
})