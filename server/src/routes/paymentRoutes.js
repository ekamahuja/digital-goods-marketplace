import express from 'express'
const paymentRoutes = express.Router()
import {stripeSession, processSession} from '../controllers/payments/stripeController.js'


paymentRoutes.post('/payments/stripe/create', stripeSession)
paymentRoutes.get('/payments/stripe/process', processSession)


export default paymentRoutes