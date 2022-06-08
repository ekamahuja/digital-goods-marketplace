import sendMail from '../utils/mailer.js'
import productData from '../config/productData.js'
import { captalize, convertTimestamp } from '../utils/basicUtils.js';


export const sendOrderConfirmationMail = async (paymentDocument) => {
    try {
        const { orderId, customerName, amountPaid, productId, quantity, updatedAt, customerEmail, paymentMethod, stripePaymentMethodData, transcationDetails } = paymentDocument
        const { SITE_NAME, CLIENT_URL, SMTP_USER } = process.env
        if (!productData[productId]) return
        const { name } = productData[productId]

        let thankyouMessage;
        let paymentSource
        const siteName = SITE_NAME
        const planName = `x${quantity} ${name}`;
        const subject = "Upgrader Purchase Confirmation"
        const time = convertTimestamp(updatedAt)
        customerName ? thankyouMessage = `Thank you, ${captalize(customerName)}!` : thankyouMessage = "Thank you!"

        if (paymentMethod === "stripe") paymentSource = `${stripePaymentMethodData.card.brand.toUpperCase()} ${stripePaymentMethodData.card.last4}`
        if (paymentMethod === "coinbase") paymentSource = `${transcationDetails.event.data.payments[0].network.toUpperCase()}`
        
        const context = {
            thankyouMessage,
            amountPaid: amountPaid.toFixed(2),
            planName,
            clientUrl: CLIENT_URL,
            sentBy: SMTP_USER,
            orderId,
            time: convertTimestamp(updatedAt),
            customerEmail,
            subject,
            paymentSource,
            siteName
        }

        const { success, message, sentEmail} = await sendMail(context, 'orderConfirmation') 
        if (!success) throw new Error(message)

        return sentEmail;
    } catch(err) {
        return false;
    }
}



