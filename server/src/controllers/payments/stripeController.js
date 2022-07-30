import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET);
import productData from "../../config/productData.js";
import Payment from "../../schemas/paymentSchema.js";
import { calculateFees, generateOrderId } from "../../helpers/paymentHelper.js";
import { generateKeys, blacklistKeys, blacklistAllOrdersByEmail } from "../../helpers/keyHelper.js";
import { sendOrderConfirmationMail } from "../../helpers/mailHelper.js";
import { getIpData } from "../../helpers/paymentHelper.js";
import { calculatePrices } from "../../helpers/affilateHelper.js"


export const stripeSession = async (req, res, next) => {
  try {
    const { affilateCode } = req.cookies
    const { pid, email, quantity } = req.query;
    if (!email) throw new Error("Please provide the email as a query");

    const pricingData = await calculatePrices(affilateCode)

    if (!pricingData[pid]) throw new Error("Invalid product ID");
    const { name, amount, description } = pricingData[pid];
    
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const ipInformation = await getIpData(ip, userAgent);
    if (ipInformation.success && ipInformation.success == false) throw new Error(ipInformation.message);

    if (ipInformation.fraudScore >= 85) throw new Error("You are not allowed to make a purchase using this payment method.");
    if (ipInformation.fraudScore >= 75 && (quantity * amount) > 10) throw new Error("You are not allowed to purchase over $10.");

    const orderId = generateOrderId()

    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.CLIENT_URL}/order/${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/#pricing`,
      customer_email: email,
      mode: "payment",
      line_items: [
        {
          name,
          amount: (amount * 100).toFixed(0),
          currency: "USD",
          quantity,
          description,
        },
      ],
      metadata: {
        orderId
      },
    });

    const paymentDocument = await Payment.create({
      sessionId: session.id,
      stripePaymentIntentData: session.payment_intent,
      orderId,
      productId: pid,
      productName: name,
      deliverdGoods: null,
      quantity,
      paymentMethod: "stripe",
      amountPaid: session.amount_total / 100,
      fee: calculateFees("stripe", session.amount_total / 100),
      customerName: null,
      customerEmail: email,
      customerCountryCode: ipInformation.countryCode,
      customerDevice: userAgent,
      customerIp: ipInformation.ip,
      memo: `Payment for ${name} - ${description}`,
      transcationDetails: null,
      status: session.paymemt_status,
      affilateCode,
    })

    if (!paymentDocument) throw new Error("Something went wrong creating a session. Please try again and If the issue consints, please contact staff.")
    
    return res.status(201).json({
      success: true,
      message: "Successfully created a Stripe session",
      session: session.url,
    });
  } catch (err) {
    next(err);
  }
};





export const stripeWebhook = async (req, res, next) => {
  try {

    const {object} = req.body.data
    const {type} = req.body
    const status = type.split(".")[1]
    let paymentDocument = await Payment.findOne({stripePaymentIntentData: object.payment_intent})
    // paymentDocument.status = status
    
 
    switch (type) {
      case 'charge.succeeded':
        const pData = productData[paymentDocument.productId]
        const paymentIntent = await stripe.paymentIntents.retrieve(object.payment_intent);
        const paymentMethod = await stripe.paymentMethods.retrieve(object.payment_method);
        const customer = await stripe.customers.retrieve(object.customer);

        paymentDocument.stripePaymentIntentData = paymentIntent
        paymentDocument.stripePaymentMethodData = paymentMethod
        paymentDocument.stripeCustomerData = customer
        paymentDocument.transcationDetails = object

        if ((paymentDocument.deliveredGoods).length == 0) {
          const keys = await generateKeys(pData.keyPrefix, pData.keyType,  pData.keyQuantity * paymentDocument.quantity)
          paymentDocument.deliveredGoods = keys
        }

        paymentDocument.status = "completed"
        paymentDocument.customerName = object.billing_details.name

        sendOrderConfirmationMail(paymentDocument);
        break;
      case 'charge.expired':
        paymentDocument.status = "expired"

        break;
      case 'charge.failed':


        break;
      case 'charge.refunded':
        paymentDocument = await Payment.findOne({"stripePaymentIntentData.id": object.payment_intent })
        paymentDocument.status = "refunded"

        await blacklistKeys(paymentDocument.deliveredGoods)
        
        await paymentDocument.save();
        break;
      case 'charge.dispute.closed':
        paymentDocument = await Payment.findOne({"stripePaymentIntentData.id": object.payment_intent })
        
        if (paymentDocument.status !== "dispute-reinstated") {
          paymentDocument.status = "dispute-closed"

          await paymentDocument.save();  
        }
        
        break;
      case 'charge.dispute.funds_reinstated':
        paymentDocument = await Payment.findOne({"stripePaymentIntentData.id": object.payment_intent })
        paymentDocument.status = "dispute-reinstated"

        await paymentDocument.save();
        break;
      break;
      case 'charge.dispute.created':
        paymentDocument = await Payment.findOne({"stripePaymentIntentData.id": object.payment_intent })
        paymentDocument.status = "dispute-opened"

        await blacklistAllOrdersByEmail(paymentDocument.customerEmail)
        await blacklistKeys(paymentDocument.deliveredGoods)

        await paymentDocument.save();
        break;
      default:
        break;
    }

    await paymentDocument.save()
    if (!paymentDocument) throw new Error("Something went wrong, please contact staff with your order ID")

    res.send()
 
  } catch(err) {
    res.status(400)
    next(err)
  }
}


