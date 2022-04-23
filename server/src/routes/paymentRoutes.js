import express from 'express'
const paymentRoutes = express.Router()
import {stripeSession, stripeWebhook} from '../controllers/payments/stripeController.js'
import {paymentsData, searchPaymentData, orderData} from '../controllers/payments/paymentController.js'
import {adminApiOnly} from '../middlewares/apiRouteProtection.js'

paymentRoutes.post('/payments/stripe/create', stripeSession)

paymentRoutes.post('/payments/stripe/webhook', stripeWebhook)

paymentRoutes.get('/payments/', adminApiOnly, paymentsData)
paymentRoutes.get('/payments/search', adminApiOnly, searchPaymentData)

paymentRoutes.get('/payments/:orderId', orderData)

export default paymentRoutes