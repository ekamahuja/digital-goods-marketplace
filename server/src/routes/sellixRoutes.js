import express from 'express'
import {sellixWebhook, sellixCreatePayment} from '../controllers/sellixController.js'
const sellixRoutes = express.Router()



sellixRoutes.get('/sellix/payments/create', sellixCreatePayment)
sellixRoutes.post('/sellix/webhook', sellixWebhook)



export default sellixRoutes

