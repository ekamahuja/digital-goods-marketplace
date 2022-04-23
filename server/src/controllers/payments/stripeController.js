import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET);
import productData from "../../config/productData.js";
import Payment from "../../schemas/paymentSchema.js";
import { calculateFees, generateOrderId } from "../../helpers/paymentHelper.js";
import { generateKeys, blacklistKeys } from "../../helpers/keyHelper.js";
import { sendDiscordWebhook } from "../../utils/discordWebhook.js";
import { sendOrderConfirmationMail } from "../../helpers/mailHelper.js";
import { getIpData } from "../../helpers/paymentHelper.js";


export const stripeSession = async (req, res, next) => {
  try {
    const { pid, email, quantity } = req.query;
    if (!email) throw new Error("Please provide the email as a query");

    if (!productData[pid]) throw new Error("Invalid product ID");
    const { name, amount, description } = productData[pid];

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const ipInformation = await getIpData(ip, userAgent);
    if (ipInformation.success && ipInformation.success == false) throw new Error(ipInformation.message);

    if (ipInformation.fraudScore >= 85) throw new Error("You are not allowed to make a purchase using this payment method.");
    if (ipInformation.fraudScore >= 75 && quantity > 1) throw new Error("You are not allowed to purchase more than 1 quantity using this payment method");

    const orderId = generateOrderId()

    const session = await stripe.checkout.sessions.create({
      // success_url: `${process.env.CLIENT_URL}/api/payments/stripe/process/?session={CHECKOUT_SESSION_ID}`,
      success_url: `${process.env.CLIENT_URL}/order/${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/order/${orderId}`,
      customer_email: email,
      mode: "payment",
      line_items: [
        {
          name,
          amount: amount * 100,
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
      status: session.paymemt_status
    })

    if (!paymentDocument) throw new Error("Something went wrong creating a session. Please try again and If the issue consints, please contact staff.")

    return res.status(201).json({
      success: true,
      message: "Successfully created a Stripe session",
      session: session.url,
    });
  } catch (err) {
    console.log(err.message)
    next(err);
  }
};





export const stripeWebhook = async (req, res, next) => {
  try {

    const {object} = req.body.data
    const {type} = req.body
    const status = type.split(".")[1]

    const paymentDocument = await Payment.findOne({stripePaymentIntentData: object.payment_intent})
    paymentDocument.status = status
    const pData = productData[paymentDocument.productId]
 

    switch (type) {
      case 'charge.succeeded':
        const paymentIntent = await stripe.paymentIntents.retrieve(object.payment_intent);
        const paymentMethod = await stripe.paymentMethods.retrieve(object.payment_method);
        const customer = await stripe.customers.retrieve(object.customer);
        paymentDocument.stripePaymentIntentData = paymentIntent
        paymentDocument.stripePaymentMethodData = paymentMethod
        paymentDocument.stripeCustomerData = customer
        paymentDocument.transcationDetails = object
        const keys = await generateKeys(pData.keyPrefix, pData.keyType,  pData.keyQuantity * paymentDocument.quantity)
        paymentDocument.status = "completed"
        paymentDocument.deliveredGoods = keys
        paymentDocument.customerName = object.billing_details.name

        sendDiscordWebhook(`:moneybag: Stripe sale for ${pData.name} ($${paymentDocument.amountPaid})`, `Order ID: ${paymentDocument.orderId}\n Product: x${paymentDocument.quantity} ${pData.name}\nFee: $${paymentDocument.fee}\n  Order Total: $${paymentDocument.amountPaid}\n Payment Status: ${paymentDocument.status}\n Customer Name: ${paymentDocument.customerName}\n Customer Email: ${paymentDocument.customerEmail}\n Customer IP: ${paymentDocument.customerIp}\n Customer Device: ${paymentDocument.customerDevice}`, "payment");
        sendOrderConfirmationMail(paymentDocument.customerEmail, paymentDocument.orderId);
        break;
      case 'charge.expired':


        break;
      case 'charge.failed':


        break;
      case 'charge.refunded':


        break;
      case 'charge.dispute.closed':
        paymentDocument.status = "dispute closed"

        break;
      case 'charge.dispute.created':
        paymentDocument.status = "dispute opened"
        blacklistKeys(paymentDocument.deliveredGoods, true)

        break;
      default:
        sendDiscordWebhook("Unhandled Stripe webhook event", `Unhandled event type ${type}`, 'error')
    }
    
    await paymentDocument.save()
    if (!paymentDocument) throw new Error("Something went wrong, please contact staff with your order Id")

    res.send()

  } catch(err) {
    console.log(err)
    res.status(400)
    sendDiscordWebhook(":x: Error Occured!", `Info: An error occured when the Stripe webhook was triggered\n Error Message: ${err.message}\n Error Stack: ${err.stack}`, "error");
    next(err)
  }
}
