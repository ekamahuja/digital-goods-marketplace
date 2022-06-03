import mongoose from 'mongoose'

const affilatePayoutSchema = mongoose.Schema({
    id: {type: Number, required: false},
    affilateCode: {type: String, required: true},
    status: {type: String, required: true, default: "pending"},
    amount: {type: Number, required: true, default: 0},
    paidOrders: [],
    disputedOrders: [],
    adminComment: {type: String, required: false}
}, {
    timestamps: true,
})


affilatePayoutSchema.pre('save', async function(next) {
    if (!this.id) {
        const amountOfPayments = await this.constructor.countDocuments({})
        this.id = amountOfPayments + 1
    }

    next()
})


const affilatePayout = mongoose.model('affilatePayout', affilatePayoutSchema)

export default affilatePayout