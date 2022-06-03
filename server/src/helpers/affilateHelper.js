import shortid from 'shortid'
import productData from "../config/productData.js";
import Affilate from '../schemas/affilateSchema.js'
import Payment from "../schemas/paymentSchema.js"
import affilatePayout from '../schemas/affilatePayoutSchema.js'
import { calculateAmount } from '../utils/basicUtils.js'


/**
 * It checks if the user has an affilate code. If they do, it returns the data. If they don't, it
 * generates a random code for the user and then creates a new affilate code in the database
 * @param userId - The user's ID.
 * @returns The data from the database.
 */
export const fetchAffilateData = async (userId) => {
    /* Checking if the user has an affilate code. If they do, it returns the data. */
    const data = await Affilate.findOne({ userId })
    if (data) return data;

    /* Generating a random code for the user and then creating a new affilate code in the database. */
    const affilateCode = shortid.generate()
    const affilate = await Affilate.create({ userId, affilateCode })


    /* Returning the affilate data from the database. */
    return affilate;
}


/**
 * It checks if the affilate code exists in the database. If it does, it returns the data. If it
 * doesn't, it returns false
 * @param affilateCode - The affilate code that the user has entered.
 * @param [increaseView=false] - If this is true, it increases the visits property of the data object.
 * @param [increaseUniqueViews=false] - If this is true, it will increase the uniqueVisits property of
 * the data object.
 * @returns The data object.
 */
export const referedUserLanded = async (affilateCode, increaseView = false, increaseUniqueViews = false) => {
    /* Checking if the affilate code exists in the database. If it does, it returns the data. If it
    doesn't, it returns false. */
    const data = await Affilate.findOne({ affilateCode })
    if (!data) return false;

    
    /* Checking if the increaseView and increaseUniqueViews parameters are true. If they are, it
    increases the visits and uniqueVisits properties of the data object. It then saves the data
    object to the database. */
    if (increaseView) data.visits++;
    if (increaseUniqueViews) data.uniqueVisits++;
    data.save();


    /* Returning the data from the function. */
    return data;
}



/**
 * It calculates the prices of the products based on the commission rate of the affilate code.
 * @param affilateCode - The affilate code that the user has entered.
 * @returns The pricingData variable.
 */
export const calculatePrices = async (affilateCode) => {
    /* Checking if the productData variable is defined. If it isn't, it throws an error. */
    if (!productData) throw new Error("Could not fetch product data");

    /* Checking if the commissionRate property is defined. If it is, it sets the commissionRate
    variable to the commissionRate property. If it isn't, it sets the commissionRate variable to 0. */
    let { commissionRate } = await Affilate.findOne({ affilateCode }) || 0;
    commissionRate ? commissionRate = commissionRate : commissionRate = 0

    /* Calculating the prices of the products. */
    const pricingData = [];
    for (const product in productData) {
        const object = {
            id: Number(product),
            name: productData[product].name,
            amount: calculateAmount(productData[product].amount, commissionRate),
            cryptoAmount: calculateAmount(productData[product].cryptoAmount, commissionRate),
            keyQuantity: productData[product].keyQuantity,
            description: productData[product].description
        };

        pricingData.push(object);
    }


    /* Returning the pricingData variable from the function. */
    return pricingData;
}





/**
 * It calculates the affilate stats for a given userId
 * @param userId - The user id of the user.
 * @returns An object with the following properties:
 * affilateData: The affilate data from the database.
 * totalOrders: The total orders the affilate has made.
 * paidOrders: The total paid orders the affilate has made.
 * conversionRate: The conversion rate of the affilate.
 * avaliableEarnings: The avaliable earnings the affil
 */
export const calculateAffilateStats = async (userId) => {
    /* Getting the affilate code from the affilate data. */
    const affilateData = await Affilate.findOne({userId})
    const {affilateCode} = affilateData

    /* Counting the total orders and the paid orders. */
    const totalOrders = await Payment.find({ affilateCode }).countDocuments()
    const paidOrders = await Payment.find({ $and: [{affilateCode}, {status: "completed"}] }).countDocuments()

    /* Calculating the conversion rate. */
    let conversionRate = ((paidOrders / affilateData.uniqueVisits) * 100).toFixed(2)
    if (isNaN(conversionRate)) conversionRate = 0
    if (conversionRate > 100) conversionRate = 100

    /* Calculating the avaliable earnings the affilate has earned and fetching all payouts linked to the affialte code. */
    // const avaliablePayoutData = await calculateAvaliablePayout(affilateCode)
    const avaliableEarnings = ((await calculateAvaliablePayout(affilateCode)).amount).toFixed(2)
    const payoutEarningsData = await affilatePayout.find({ $and: [{affilateCode}, {status: {$ne: "denied" }}]})

    /* Looping through the payoutEarningsData array and then it is adding the amount property of the
    payout object to the payoutEarnings variable. It is then setting the payoutEarnings variable to
    the payoutEarnings variable with the toFixed() method. */
    let payoutEarnings = 0
    for (const payout of payoutEarningsData) {
        payoutEarnings += payout.amount
    }
    payoutEarnings = payoutEarnings.toFixed(2)


    /* Returning the data from the function. */
    return { affilateData, totalOrders, paidOrders, conversionRate, avaliableEarnings, payoutEarnings }
}



/**
 * It calculates the amount of money the affilate has earned and the orders that the affilate has
 * earned money from
 * @param affilateCode - The affilate code of the affilate.
 * @param [updateStatus=false] - A boolean that determines whether or not the payoutCalculated property
 * of the order object should be set to true.
 * @returns An object with the following properties:
 * amount: The amount of money the affilate has earned.
 * orders: The orders that the affilate has earned money from.
 * disputedOrders: The orders that have been disputed.
 */
export const calculateAvaliablePayout = async (affilateCode, updateStatus = false) => {
   /* Fetching all the orders that have not been calculated for the affilate code and then it is
   calculating the disputes for the affilate code. */
    const affilateOrders = await Payment.find({ $and: [ {affilateCode}, {payoutCalculated: false}, {status: "completed"} ] })
    const disputeData = await calculateDisputes(affilateCode)
    /* Creating two variables. One is called amount and the other is called paidOrders. The amount variable
    is set to 0 and the orders variable is set to an empty array. */
    let amount = 0  
    const paidOrders = []

    /* Looping through the affilateOrders array and then it is getting the orderId, amountPaid, fee and
    productId properties from the order object. It is then checking if the
    productData[order.productId] is defined. If it isn't, it continues to the next iteration. It is
    then pushing the orderId to the paidOrders array. It is then getting the priceOfProduct variable
    from the productData object. It is then adding the amountPaid - priceOfProduct - (fee / 2) to
    the amount variable. It is then checking if the updateStatus parameter is true. If it is, it
    sets the payoutCalculated property of the order object to true and then it saves the order
    object to the database. */
    for (const order of affilateOrders) {
        const {orderId, amountPaid, fee, productId} = order

        if (!(productData[order.productId])) continue;

        paidOrders.push(orderId)

        const priceOfProduct = productData[productId].amount
        amount += ((amountPaid - priceOfProduct) - (fee / 2))

        if (updateStatus) {
            order.payoutCalculated = true;
            await order.save()
        }
    }

    /* Subtracting the disputedAmount of the dispute(s) from the amount variable. */
    amount -= disputeData.disputedAmount
 

    /* Returning an object with the following properties:
    amount: The amount of money the affilate has earned.
    orders: The orders that the affilate has earned money from.
    disputedOrders: The orders that have been disputed. */
    return { amount, paidOrders, disputedOrders: disputeData.newDisputedOrders  }
}



/**
 * Calculating the amount of money that has been disputed and the orders that have been disputed.
 * @param affilateCode - The affilate code of the affilate.
 * @returns An object with the following properties:
 * disputedAmount: The amount of money that has been disputed.
 * newDisputedOrders: The orders that have been disputed.
 */
export const calculateDisputes = async (affilateCode) => {
    /* Fetching all the payouts that are not denied and all the orders that are in dispute. */
    const payouts = await affilatePayout.find({ $and: [{affilateCode}, {status: { $ne: "denied" }}] })
    const disputedOrders = await Payment.find({ $and: [{affilateCode}, {status: "dispute-opened"}] })

    /* Creating three variables. The first one is called calculatedDisputedOrders and it is
    set to an empty array. The second one is called newDisputedOrders and it is set to an empty
    array.
    The third one is called disputedAmount and it is set to 0. */
    const calculatedDisputedOrders = []
    const newDisputedOrders = []
    let disputedAmount = 0;


    /* Looping through the payouts array and then it is looping through the disputeOrders array
    and then it is pushing the order to the calculatedDisputedOrders array. */
    for (const { disputedOrders } of payouts) {
        disputedOrders.forEach(order => calculatedDisputedOrders.push(order))
    }

    /* Looping through the disputedOrders array and then it is checking if the orderId is in the
    calculatedDisputedOrders array. If it is, it continues to the next iteration. It is then
    checking if the productData[productId] is defined. If it isn't, it continues to the next
    iteration. It is then getting the amount property from the productData object. It is then adding
    the amountPaid - amount to the amount variable. It is then pushing the orderId to the
    newDisputedOrders array. */
    for (const { amountPaid, orderId, productId, fee } of disputedOrders) {
        if (!payouts.length) break;
        const orderAlreadyAccountedFor = calculatedDisputedOrders.find(order => order === orderId)
        if (orderAlreadyAccountedFor) continue;
        if (!productData[productId]) continue;

        const { amount } = productData[productId]
        disputedAmount += ((amountPaid - amount) - (fee / 2));

        newDisputedOrders.push(orderId)
    }

    /* Returning an object with the following properties:
    disputedAmount: The amount of money that has been disputed.
    newDisputedOrders: The orders that have been disputed. */
    return { disputedAmount, newDisputedOrders }
}


/**
 * It takes an array of orderIds and a boolean value and updates the payoutCalculated field of the
 * orders with the orderIds in the array to the boolean value
 * @param orders - An array of orderIds.
 * @param value - Boolean
 * @returns True.
 */
export const updatePayoutCaclulated = async (orders, value) => {
    /* Checking if the orders variable is an array and if the value variable is a boolean. */
    if (!Array(orders)) throw new Error("orders variables must be an array")
    if (!Boolean(value)) throw new Error("value must be a boolean")

    /* Looping through the orders and updating the payoutCalculated field. */
    for (const orderId of orders) {
        const order = await Payment.findOne({ orderId })
        if (!order) continue;

        order.payoutCalculated = value;

        await order.save()
    }


    /* Returning true. */
    return true;
}


