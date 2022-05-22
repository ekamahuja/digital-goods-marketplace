import Payment from '../../schemas/paymentSchema.js'


export const paymentsData = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 0

        const documentPerLimit = parseInt(process.env.PAGE_LIMIT)
        const totalPayments = await Payment.countDocuments()
        const totalPages = Math.ceil(totalPayments / documentPerLimit)

        const payments = await Payment.find({}).limit(documentPerLimit).skip(documentPerLimit * page).select("-transcationDetails").select("-__v").sort({createdAt: -1})
        if (!payments) throw new Error('Payments could not be fetched')
        if (payments.length == 0) throw new Error("No payments exist or Invalid page")

        return res.status(200).json({success: true, paymentsOnThisPage: payments.length, totalPayments, totalPages, payments})
    } catch(err) {
        next(err)
    }

}



export const searchPaymentData = async (req, res, next) => {
    try {
        let  {query} = req.query
        if (!query) throw new Error("no query provided")
        query = query.trim()

        let paymentData = await Payment.find({orderId: {$regex: new RegExp('^'+query+'.*','i')}}).exec()
        if (!paymentData.length) {
            paymentData = await Payment.find({customerEmail: {$regex: new RegExp('^'+query+'.*','i')}}).exec()
        }
        if (!paymentData.length) {  
            paymentData = await Payment.find({coinbaseCode: {$regex: new RegExp('^'+query+'.*','i')}}).exec()
        }

        return res.status(200).json({success: true, message: "Successfully fetched", payments: paymentData})

    } catch(err) {
        next(err)
    }
}



export const orderData = async (req, res, next) => {
    try {
        const {orderId} = req.params

        const paymentDocument = await Payment.findOne({orderId})
        if (!paymentDocument) {
            res.status(404)
            throw new Error("Order not found")
        }
        return res.json({success: true, message: "Order successfully fetched", orderData: {
            status: paymentDocument.status,
            deliveredGoods: paymentDocument.deliveredGoods
        }})
    } catch(err) {
        next(err)
    }
}