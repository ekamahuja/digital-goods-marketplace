import mongoose from 'mongoose'


const paymentSchema = mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    productId: {
        type: Number,
        required: true
    },
    deliveredGoods: {
        type: Array,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    customerDevice: {
        type: String,
        required: true
    },
    customerIp: {
        type: String,
        required: true
    },
    memo: {
        type: String,
        required: false
    },
    transcationDetails: { 
        type: Object,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "Pending"
    }
}, {
    timestamps: true
});


const Payment =  mongoose.model('Payment', paymentSchema);


export default Payment