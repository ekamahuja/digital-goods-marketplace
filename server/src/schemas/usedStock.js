import mongoose from 'mongoose'


export const usedStockSchema = mongoose.Schema({
    inviteLink: {
        type: String,
        required: true
    },
    inviteAddress: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})



export const usedStock = mongoose.model("usedStock", usedStockSchema)