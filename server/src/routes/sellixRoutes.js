import express from 'express'
import {sellixWebhook} from '../controllers/sellixController.js'
const sellixRoutes = express.Router()


sellixRoutes.post('/sellix/webhook', sellixWebhook)

export default sellixRoutes

