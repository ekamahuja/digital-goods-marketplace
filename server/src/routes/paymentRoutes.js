import express from 'express'
const paymentRoutes = express.Router()
import {stripeSession, processSession} from '../controllers/payments/stripeController.js'
import {paymentsData} from '../controllers/payments/paymentController.js'
import {adminApiOnly} from '../middlewares/apiRouteProtection.js'

paymentRoutes.post('/payments/stripe/create', stripeSession)
paymentRoutes.get('/payments/stripe/process', processSession)


paymentRoutes.get('/payments/all', adminApiOnly, paymentsData)


export default paymentRoutes