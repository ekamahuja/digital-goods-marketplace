import mongoose from 'mongoose'


export const autoRestockSchema = mongoose.Schema({
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



export const autoRestock = mongoose.model("autoRestock", autoRestockSchema)