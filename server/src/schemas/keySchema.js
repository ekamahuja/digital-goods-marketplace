import mongoose from 'mongoose'

export const keySchema = mongoose.Schema({
    value: {
        type: String,
        required: "Key value missing",
        unique: true
    }, 
    type: {
        type: String,
        required: "Key type missing",
        enum: {
            values: ['onetime', 'lifetime', 'unlimited', 'admin'],
            message: 'The key type can only have one of these values: One-time, Lifetime, Unlimited or Admin'
        }
    },
    used: {
        type: Boolean,
        required: true,
        default: false
    },
    replacementsClaimed: {
        type: Number,
        required: true,
        default: 0
    },
    totalReplacementsClaimed: {
        type: Number,
        required: true,
        default: 0
    },
    blacklisted: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
})



export const Key = mongoose.model('Key', keySchema)