import sendMail from '../utils/mailer.js'
import {sendDiscordWebhook} from '../utils/discordWebhook.js'

export const sendOrderConfirmationMail = async (email, orderId) => {
    try {
        const title = `Order Compeleted (${orderId}) - Thank you for your order`
        const body = `Thank you for placing your Order! You can find a link to your order below. </br></br><a href="https://upgrader.pw/order/${orderId}">View Order</a>`
        
        const sentMail = await sendMail(email, title, body)
        if (!sentMail.sucess) throw new Error(sentMail.message)
    } catch(err) {
        sendDiscordWebhook(':x: Error Occured!', `Info: An error occured while sending order confirmation mail.\n Error Message: ${err.message}\n Error Stack: ${err.stack}`,  'error')
    }
}



export const sendCryptoPaymentReceivedMail = async (email, orderId) => {
    try {
        const title = `Payment received! (Order ID: ${orderId})`
        const body = `We have received your cryptocurrency payment. Your order status is "Awaiting payment confirmation" until your payment is confirmed on the blockchain. This process can take anywhere from 5 miniutes to 1 hour. Your key(s) will be issues once your payment is confirmed. </br></br><a href="https://upgrader.pw/order/${orderId}">View Order</a>`
    
        const sentMail = await sendMail(email, title, body)
        if (!sentMail.sucess) throw new Error(sentMail.message)
    } catch(err) {
        console.log(err)
        sendDiscordWebhook(':x: Error Occured!', `Info: An error occured while sending Cryptocurrency payment received mail.\n Error Message: ${err.message}\n Error Stack: ${err.stack}`,  'error')
    }
}