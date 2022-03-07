import mongoose from 'mongoose'

export const countrySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    countryCode: {
        type: String,
        required: true,
        unique: true
    },
    stock: [{
        inviteLink: {
            type: String,
            required: "inviteLink missing"
        },
        inviteAddress: {
            type: String,
            required: "inviteAddress missing"
        }
    }]
}, {
    timestamps: true,
})



export const Country = mongoose.model('Stock', countrySchema)