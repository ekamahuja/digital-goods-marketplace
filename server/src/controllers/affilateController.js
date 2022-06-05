import Affilate from "../schemas/affilateSchema.js";
import { Config } from '../schemas/configSchema.js'
import affilatePayout from '../schemas/affilatePayoutSchema.js'
import { calculatePrices, calculateAvaliablePayout, fetchAffilateData, updatePayoutCaclulated } from "../helpers/affilateHelper.js"
import validator from 'validator'
import {User} from "../schemas/userSchema.js"

export const affilateSetup = async (req, res, next) => {
  try {
    let { commission, payment, isSetup } = req.body;
    isSetup = isSetup || false

    if (!commission || !payment) throw new Error ("Please enter all fields");
    if (!validator.isEmail(payment)) throw new Error("Must provide a valid paypal email");
    if (!Number(commission)) throw new Error("Please enter a valid number for the commission rate %");

    if (commission < 0) throw new Error("Minimum commission must be greater than 0%")
    if (commission < 1) commission = 1
    if (commission > 200) throw new Error("You must contact staff to set a commission rate higher than 200%");

    const affilate = await Affilate.findOneAndUpdate(
      { userId: req.user.userId },
      { commissionRate: Number(commission).toFixed(2), paypal: payment, affilateSetup: true }
    );

    const message = isSetup ? "Successfully compeleted setup!" : "Successfully updated!"

    return res.json({ success: true, message, affilate });

  } catch (err) {
    next(err);
  }
};


/**
 * It fetches the affilateCode from the cookies and then it is passing it to the calculatePrices
 * function to get the pricingData.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - This is a function that you call to pass control to the next matching route.
 * @returns The pricingData is being returned.
 */
export const affilatePricing = async (req, res, next) => {
  try {
    /* Fetching the affilateCode from the cookies and then it is passing it to the calculatePrices
    function to get the pricingData. */
    const { affilateCode } = req.cookies;
    const pricingData = await calculatePrices(affilateCode);


    /* Returning a response to the client. */
    return res.status(200).json({ pricingData })
  } catch (err) { 
    next(err);
  }
};




/**
 * It creates a new payout request.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - This is a function that is used to pass the error to the error handler.
 */
export const createPayout = async (req, res, next) => {
  try {
    /* Destructuring the userId from the req.user object. */
    const { userId } = req.user

    /* It is fetching the affilateCode and
    suspended status from the database. If the affilateCode is not found, it will throw an error. If
    the user is suspended, it will throw an error. */
    const { affilateCode, suspended } = await fetchAffilateData(userId)
    if (!affilateCode) throw new Error("Something went wrong! Could not fetch affilate data!")
    if (suspended) throw new Error("You are suspended from the affilate system. Please contact staff for further detatils")

    /* Checking to see if the user has a pending payout request. If they do, it will throw an error. */
    const pendingPayouts = await affilatePayout.findOne({ $and: [ { affilateCode }, { status: "pending" } ] })
    if (pendingPayouts) throw new Error("You already have a pending payout request.")

    /* Fetching the amount, paidOrders, and disputedOrders from the calculateAvaliablePayout function.
    If the amount is less than or equal to 0, it will throw an error. */
    const { affilateMinimumPayout } = await Config.findOne({})
    const { amount, paidOrders, disputedOrders } = await calculateAvaliablePayout(affilateCode, false)
    if (amount <= 0) throw new Error("You do not have any avaliable earnings")
    if (amount <= affilateMinimumPayout) throw new Error(`Payouts can only be created with at least $${affilateMinimumPayout} in avaliable earnings`)

    const allOrders = paidOrders.concat(disputedOrders)
    const updateOrders = await updatePayoutCaclulated(allOrders, true)
    if (!updateOrders) throw new Error("Something went wrong! Try again and If the issue presists, please contact staff.")

    /* Creating a new payout request. */
    const payoutData = await affilatePayout.create({ affilateCode, amount: amount.toFixed(2), paidOrders, disputedOrders })


    /* Sending a response to the client. */
    res.status(201).json({ success: true, message: "Successfully created payout request", payoutData })
  } catch(err) {
    next(err)
  }
}


/**
 * It fetches all of the payouts that are associated with the affilateCode
 * @param req - The request object.
 * @param res - The response object.
 * @param next - This is a function that is used to pass the error to the error handler.
 * @returns The fetchPayouts function is returning a response to the client.
 */
export const fetchPayouts = async (req, res, next) => {
  try {
    /* Destructuring the userId from the req.user object. Then it is fetching the affilateCode from the
    database. */
    const { userId } = req.user
    const { affilateCode } = await fetchAffilateData(userId)

    /* Fetching all of the payouts that are associated with the affilateCode. If there are no payouts,
    it will throw an error. */
    const payouts = await affilatePayout.find({ affilateCode })
    if (!payouts.length) throw new Error("No payouts found")


    /* Sending a response to the client. */
    return res.status(200).json({ success: true, message: "Successfully fetched payouts", payouts })
  } catch(err) {
    next(err)
  }
}




export const updatePayoutStatus = async (req, res, next) => {
  try {
    const { status, id, comment } = req.query 
    if (!(status && id && comment)) throw new Error("Must provide status, payout Id and a comment")

    const payout = await affilatePayout.findOne({ id })
    if (!payout) throw new Error("Could not find Payout")
    if (payout.status !== "pending") throw new Error(`The status of the this payout has already been set to ${payout.status} and cannot be changed.`)

    payout.adminComment = comment

    switch(status) {
      case "paid":
        payout.status = status
        break;
      case "denied":
        payout.status = status
        await updatePayoutCaclulated(payout.paidOrders, false)
        await updatePayoutCaclulated(payout.disputedOrders, false)
        break;
    default:
      throw new Error("Invalid status provided")
    }

    await payout.save()

    res.json({success: true, message: "Successfully updated status", payout })
  } catch(err) {
    next(err)
  }
}




export const fetchAllPayouts = async (req, res, next) => {
  try {
    const payouts = await affilatePayout.find({})
    
    res.status(200).json({ success: true, message: "Successfully fetched all payouts", payouts })
  } catch(err) {
    next(err)
  }
}


export const fetchUserData = async (req, res, next) => {
  try {
    const { affilateCode } = req.query
    if (!affilateCode) throw new Error("No affilate code provided")

    const affilateData = await Affilate.findOne({ affilateCode })
    if (!affilateData) throw new Error("Affilate data not found!")

    const userData = await User.findOne({ id: affilateData.userId })
    if (!userData) throw new Error("User data not found!")

    const currentBalance = (await calculateAvaliablePayout(affilateCode)).amount

    res.status(200).json({ success: true, message: "Successfully fetched all data", affilateData, userData, currentBalance})

  } catch(err) {
    next(err)
  }
}