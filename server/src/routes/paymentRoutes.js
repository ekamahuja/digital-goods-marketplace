import express from 'express'
const paymentRoutes = express.Router()
import {stripeSession, stripeWebhook} from '../controllers/payments/stripeController.js'
import {coinbaseSession, coinbaseWebhook    } from '../controllers/payments/coinbaseController.js'
import {paymentsData, searchPaymentData, orderData} from '../controllers/payments/paymentController.js'
import {adminApiOnly, adminAndModeratorApiOnly} from '../middlewares/apiRouteProtection.js'

import Payment from '../schemas/paymentSchema.js'
import { sendOrderConfirmationMail } from '../helpers/mailHelper.js'

paymentRoutes.post('/payments/stripe/create', stripeSession)
paymentRoutes.post('/payments/coinbase/create', coinbaseSession)


paymentRoutes.post('/payments/stripe/webhook', stripeWebhook)
paymentRoutes.post('/payments/coinbase/webhook', coinbaseWebhook)


paymentRoutes.get('/payments/', adminApiOnly, paymentsData)
paymentRoutes.get('/payments/search', adminApiOnly, searchPaymentData)

paymentRoutes.get('/payments/:orderId', orderData)

paymentRoutes.get('/payments/:orderId/email-resend', adminApiOnly, async (req, res) => {
    try {
        const { orderId } = req.params
    
        const payment = await Payment.findOne({orderId})
        if (!payment) throw new Error('Payment not found')

        const mail = await sendOrderConfirmationMail(payment)
        
        res.json({success: true, message: "Mail sent successfully", mail})

    } catch(err) {
        next(err)
    }
})

export default paymentRoutes