import express from 'express'
const paymentRoutes = express.Router()
import { stripeSession, stripeWebhook } from '../controllers/payments/stripeController.js'
import { coinbaseSession, coinbaseWebhook } from '../controllers/payments/coinbaseController.js'
import { paymentsData, searchPaymentData, orderData, resendMail } from '../controllers/payments/paymentController.js'
import { adminApiOnly, adminAndModeratorApiOnly } from '../middlewares/apiRouteProtection.js'

paymentRoutes.post('/payments/stripe/create', stripeSession)
paymentRoutes.post('/payments/coinbase/create', coinbaseSession)


paymentRoutes.post('/payments/stripe/webhook', stripeWebhook)
paymentRoutes.post('/payments/coinbase/webhook', coinbaseWebhook)


paymentRoutes.get('/payments/', adminApiOnly, paymentsData)
paymentRoutes.get('/payments/search', adminAndModeratorApiOnly, searchPaymentData)

paymentRoutes.get('/payments/:orderId', orderData)

paymentRoutes.post('/payments/email/:orderId', adminAndModeratorApiOnly, resendMail)

export default paymentRoutes