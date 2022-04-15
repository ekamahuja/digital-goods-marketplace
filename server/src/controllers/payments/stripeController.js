import Stripe from 'stripe'
const stripe = Stripe(process.env.STRIPE_SECRET)
import productData from '../../config/productData.js'
import Payment from '../../schemas/paymentSchema.js'
import {calculateFees, generateOrderId} from '../../helpers/paymentHelper.js'
import {generateKeys} from '../../helpers/keyHelper.js'


export const stripeSession = async (req, res, next) => {
    try {
        const {pid, email, quantity} = req.query
        if (!email) throw new Error('Please provide the email as a query')

        if (!productData[pid]) throw new Error("Invalid product ID")
        const {name, amount, description} = productData[pid]

        const session = await stripe.checkout.sessions.create({
            success_url: `${process.env.CLIENT_URL}/api/payments/stripe/process/?session={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/#pricing`,
            customer_email: email,
            mode: 'payment',
            line_items: [
                {
                    name,
                    amount: amount * 100,
                    currency: 'USD',
                    quantity,
                    description
                }
            ],
            metadata: {
                pid,
                quantity,
                memo: `Payment for ${name} - ${description}`,
            }
        })

        return res.status(201).json({ success: true, message: "Successfully create Stripe session", session: session.url})
    } catch(err) {
        next(err)
    }
}



export const processSession = async (req, res, next) => {
    try {
        const {session} = req.query
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const userAgent = req.headers['user-agent'] || null

        if (!session) {
            res.status(422)
            throw new Error("No session ID provided")
        }

        const stripeSession = await stripe.checkout.sessions.retrieve(session)

        if (!productData[stripeSession.metadata.pid]) throw new Error("Could not fetch product data")
        const pData = productData[stripeSession.metadata.pid]

        if (stripeSession.payment_status == "unpaid") throw new Error(`UnPaid Session`)
        if (stripeSession.payment_status != "paid") throw new Error(`Payment not completed. Status: ${stripeSession.payment_status}`)


        let paymentDocument = await Payment.findOne({sessionId: stripeSession.id})
        if (paymentDocument) {
            return res.redirect(`${process.env.CLIENT_URL}/order/${paymentDocument.orderId}`)
        }

        const generatedKeys = await generateKeys(pData.keyPrefix, pData.keyType, (pData.keyQuantity * stripeSession.metadata.quantity))        

        paymentDocument = await Payment.create({
            sessionId: stripeSession.id,
            orderId: generateOrderId(),
            productId: stripeSession.metadata.pid,
            deliveredGoods: generatedKeys,
            quantity: stripeSession.metadata.quantity,
            paymentMethod: "stripe",
            amountPaid: stripeSession.amount_total  / 100,
            fee: calculateFees('stripe', (stripeSession.amount_total / 100)),
            customerName: stripeSession.customer_details.name,
            customerEmail: stripeSession.customer_email,
            customerDevice: userAgent,
            customerIp: ip,
            memo: stripeSession.metadata.memo,
            transcationDetails: stripeSession,
            status: stripeSession.payment_status
        })

        
        return res.redirect(`${process.env.CLIENT_URL}/order/${paymentDocument.orderId}`)

    } catch (err) {
        next(err)
    }
}
