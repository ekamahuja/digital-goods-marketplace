import coinbase from 'coinbase-commerce-node'
const Client = coinbase.Client
Client.init(process.env.COINBASE_API_KEY)
import Payment from "../../schemas/paymentSchema.js";
import productData from "../../config/productData.js";
import {calculateFees, generateOrderId, getIpData } from "../../helpers/paymentHelper.js";
import { generateKeys } from "../../helpers/keyHelper.js";


export const coinbaseSession = async (req, res, next) => {
    try {
        const {pid, email, quantity} = req.query
        
        if (!pid || !email || !quantity) throw new Error("Missing product ID, email or quantity")

        if (!productData[pid]) throw new Error("Invalid product ID");
        let { name, cryptoAmount, description } = productData[pid];

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
            status: "created"
        })

        if (!paymentDocument) throw new Error("Could not save order!")

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
        console.log(event.type)
        const status = (event.type).split(".")[1]
        const paymentDocument = await Payment.findOne({id: event.data.id})
        if (!paymentDocument) throw new Error("Could not find payment document")
        const pData = productData[paymentDocument.productId]
        paymentDocument.status = status

        switch (event.type) {
            case 'charge:created':

                break;
            case 'charge:pending':

                break;
            case 'charge:delayed':

                break;   
            case 'charge:pending':

                break;
            case 'charge:confirmed':
                const keys = await generateKeys(pData.keyPrefix, pData.keyType,  pData.keyQuantity * paymentDocument.quantity)
                paymentDocument.deliveredGoods = keys
                paymentDocument.status = "completed"

                sendDiscordWebhook(`:moneybag: Stripe sale for ${pData.name} ($${paymentDocument.amountPaid})`, `Order ID: ${paymentDocument.orderId}\n Product: x${paymentDocument.quantity} ${pData.name}\nFee: $${paymentDocument.fee}\n  Order Total: $${paymentDocument.amountPaid}\n Payment Status: ${paymentDocument.status}\n Customer Email: ${paymentDocument.customerEmail}\n Customer IP: ${paymentDocument.customerIp}\n Customer Device: ${paymentDocument.customerDevice}`, "payment");
                sendOrderConfirmationMail(paymentDocument.customerEmail, paymentDocument.orderId);
                break;
            case 'charge:failed':

                break;
            case 'charge:resolved':

                break;
            default:

                break;
        }
        await paymentDocument.save()

        res.send()
    } catch(err) {
        console.log(err)
        next(err)
    }
}