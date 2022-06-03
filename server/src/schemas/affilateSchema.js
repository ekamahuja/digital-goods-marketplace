import mongoose from 'mongoose';



const affilateSchema = mongoose.Schema({
    userId: {type: Number, required: true, unique: true},
    affilateCode: {type: String, required: true, unique: true}, 
    visits: {type: Number, required: true, default: 0},
    uniqueVisits: {type: Number, required: true, default: 0},
    referals: {type: Number, required: true, default: 0},
    commissionRate: {type: Number, required: true, default: 5},
    paypal: {type: String, required: false, lowercase: true},
    affilateSetup: {type: Boolean, required: true, default: false},
    suspended: {type: Boolean, required: true, default: false}
}, {
    timestamps: true
})

const Affilate = mongoose.model('affilate', affilateSchema)


export default Affilate