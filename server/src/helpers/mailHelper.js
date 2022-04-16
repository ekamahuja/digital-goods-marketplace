import sendMail from '../utils/mailer.js'
import {sendDiscordWebhook} from '../utils/discordWebhook.js'

export const sendOrderConfirmationMail = async (email, orderId) => {
    try {
        const title = `Order Compeleted (${orderId}) - Thank you for your order`
        const body = `Thank you for placing your Order! You can find a link to your order below. </br></br><a href="${process.env.CLIENT_URL}/order/${orderId}">View Order</a>`
        
        const sentMail = await sendMail(email, title, body)
        if (!sentMail.sucess) throw new Error(sentMail.message)
    } catch(err) {
        sendDiscordWebhook(':x: Error Occured!', `Info: An error occured while sending order confirmation mail.\n Error Message: ${err.message}\n Error Stack: ${err.message}`,  'error')
    }
}