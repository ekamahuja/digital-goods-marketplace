import Payment from '../../schemas/paymentSchema.js'


export const paymentsData = async (req, res, next) => {
    try {
        const payments = await Payment.find({})
        if (!payments) throw new Error("No payments found")

        return res.status(200).json({ success: true, message: "Successfully fetched orders", payments})
    } catch(err) {
        next(err)
    }
}