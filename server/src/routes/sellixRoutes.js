import express from 'express'
import {sellixWebhook, sellixBlacklist} from '../controllers/sellixController.js'
const sellixRoutes = express.Router()


sellixRoutes.post('/sellix/webhook', sellixWebhook)
sellixRoutes.get('/sellix/blacklist/:blacklist', sellixBlacklist)

export default sellixRoutes

