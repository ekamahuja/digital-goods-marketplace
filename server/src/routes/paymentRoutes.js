import express from 'express';
const paymentRoutes = express.Router();
import { stripeSession, stripeWebhook } from '../controllers/payments/stripeController.js';
import { coinbaseSession, coinbaseWebhook } from '../controllers/payments/coinbaseController.js';
import { paymentsData, searchPaymentData, orderData, resendMail, checkIfNewOrderAndSaveCookie } from '../controllers/payments/paymentController.js';
import { adminApiOnly, adminAndModeratorApiOnly, checkIfRecentPaidOrder } from '../middlewares/apiRouteProtection.js';

paymentRoutes.post('/payments/stripe/create', checkIfRecentPaidOrder, stripeSession)
paymentRoutes.post('/payments/coinbase/create', checkIfRecentPaidOrder, coinbaseSession)


paymentRoutes.post('/payments/stripe/webhook', stripeWebhook)
paymentRoutes.post('/payments/coinbase/webhook', coinbaseWebhook)


paymentRoutes.get('/payments/', adminApiOnly, paymentsData)
paymentRoutes.get('/payments/search', adminAndModeratorApiOnly, searchPaymentData)

paymentRoutes.get('/payments/:orderId', orderData)

paymentRoutes.post('/payments/email/:orderId', adminAndModeratorApiOnly, resendMail)

paymentRoutes.get('/payments/order-cookie/:orderId', checkIfNewOrderAndSaveCookie)

export default paymentRoutes