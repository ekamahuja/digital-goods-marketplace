import mongoose from 'mongoose'


const paymentSchema = mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    stripePaymentIntentData: {
        type: Object || String,
        required: false,
    },
    stripePaymentMethodData: {
        type: Object,
        required: false
    },
    stripeCustomerData: {
        type: Object,
        required: false
    },
    coinbaseCode: {
        type: String,
        required: false
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
    productName: {
        type: String,
        required: true
    },
    deliveredGoods: {
        type: Array,
        required: false
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
        required: false
    },
    customerEmail: {
        type: String,
        required: true
    },
    customerCountryCode: {
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
        required: true
    },
    transcationDetails: { 
        type: Object,
        required: false
    },
    status: {
        type: String,
        required: true,
        default: "pending"
    }
}, {
    timestamps: true
});


const Payment =  mongoose.model('Payment', paymentSchema);


export default Payment