import coinbase from 'coinbase-commerce-node'
const Client = coinbase.Client
const Webhook = coinbase.Webhook
Client.init(process.env.COINBASE_API_KEY)
import Payment from "../../schemas/paymentSchema.js";
import productData from "../../config/productData.js";
import { calculateFees, generateOrderId, getIpData } from "../../helpers/paymentHelper.js";
import { generateKeys } from "../../helpers/keyHelper.js";
import { sendOrderConfirmationMail } from "../../helpers/mailHelper.js";
import { calculatePrices } from "../../helpers/affilateHelper.js"

/**
 * It creates a payment session with Coinbase Commerce and saves the payment details to a database
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function in the stack.
 * @returns The session object is being returned.
 */
export const coinbaseSession = async (req, res, next) => {
    try {
        const { affilateCode } = req.cookies;
        const { pid, email, quantity } = req.query
        
        if (!pid || !email || !quantity) throw new Error("Missing product ID, email or quantity")

        const pricingData = await calculatePrices(affilateCode)

        if (!pricingData[pid]) throw new Error("Invalid product ID");
        let { name, cryptoAmount, description } = pricingData[pid];

        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const userAgent = req.headers["user-agent"];

        const ipInformation = await getIpData(ip, userAgent);
        if (ipInformation.success && ipInformation.success == false) throw new Error(ipInformation.message);

        const orderId = generateOrderId()
    
        description = (quantity > 1) ? `${description}s, Qty ${quantity}, US$${cryptoAmount} each` : description;

        const chargeData = {
            name: `x${quantity} ${name}`,
            description,
            local_price: {
                amount: cryptoAmount * quantity,
                currency: "USD"
            },
            pricing_type: 'fixed_price',
            metadata: {
                orderId
            },
            redirect_url: `${process.env.CLIENT_URL}/order/${orderId}`,
            cancel_url: `${process.env.CLIENT_URL}/#pricing`
        }

        const session = await coinbase.resources.Charge.create(chargeData)

        const paymentDocument = await Payment.create({
            sessionId: session.id,
            coinbaseCode: session.code,
            orderId,
            productId: pid,
            productName: name,
            deliverdGoods: null,
            quantity,
            paymentMethod: "coinbase",
            amountPaid: chargeData.local_price.amount,
            fee: calculateFees("coinbase", chargeData.local_price.amount),
            customerName: null,
            customerEmail: email,
            customerCountryCode: ipInformation.countryCode,
            customerDevice: userAgent,
            customerIp: ipInformation.ip,
            memo: `Payment for ${name} - ${description}`,
            transcationDetails: session,
            status: "pending",
            affilateCode
        })

        return res.status(201).json({
            success: true,
            message: "Successfully created a Coinbase Commerce session",
            session: session.hosted_url,
        });

    } catch(err) {
        next(err)
    }
}




export const coinbaseWebhook = async (req, res, next) => {
    try {
        const {event} = req.body
        let status = (event.type).split(":")[1]
        const paymentDocument = await Payment.findOne({sessionId: event.data.id})
        if (!paymentDocument) throw new Error("Could not find payment document")
        const pData = productData[paymentDocument.productId]
        paymentDocument.status = status
        paymentDocument.transcationDetails = req.body


        status = (status != "resolved") ? status : "confirmed"
        switch (status) {
            case 'created':
                paymentDocument.status = "pending"
                break;
            case 'pending':
                paymentDocument.status = "awaiting-confirmation"
                break;
            case 'delayed':

                break;   
            case 'confirmed':
                if ((paymentDocument.deliveredGoods).length == 0) {
                    const keys = await generateKeys(pData.keyPrefix, pData.keyType,  pData.keyQuantity * paymentDocument.quantity)
                    paymentDocument.deliveredGoods = keys
                }

                paymentDocument.status = "completed"

                sendOrderConfirmationMail(paymentDocument.customerEmail, paymentDocument.orderId);
                break;
            case 'failed':
                paymentDocument.status = "expired"
                break;
            case 'resolved':
                
                break;
            default:
                break;
        }

        const updatedPaymentDocument = await paymentDocument.save()
        if (!updatedPaymentDocument) throw new Error("Could not update payment document")

        res.send()
    } catch(err) {
        next(err)
    }
}