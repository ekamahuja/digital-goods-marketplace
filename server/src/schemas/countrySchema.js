import mongoose from 'mongoose'

export const countrySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: "The name of this country already exists"
    },
    countryCode: {
        type: String,
        required: true,
        unique: "The countryCode of this country already exists"
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