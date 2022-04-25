import express from 'express'
const paymentRoutes = express.Router()
import {stripeSession, stripeWebhook} from '../controllers/payments/stripeController.js'
import {coinbaseSession, coinbaseWebhook    } from '../controllers/payments/coinbaseController.js'
import {paymentsData, searchPaymentData, orderData} from '../controllers/payments/paymentController.js'
import {adminApiOnly} from '../middlewares/apiRouteProtection.js'



paymentRoutes.post('/payments/stripe/create', stripeSession)
paymentRoutes.post('/payments/coinbase/create', coinbaseSession)


paymentRoutes.post('/payments/stripe/webhook', stripeWebhook)
paymentRoutes.post('/payments/coinbase/webhook', coinbaseWebhook)


paymentRoutes.get('/payments/', adminApiOnly, paymentsData)
paymentRoutes.get('/payments/search', adminApiOnly, searchPaymentData)

paymentRoutes.get('/payments/:orderId', orderData)

export default paymentRoutes