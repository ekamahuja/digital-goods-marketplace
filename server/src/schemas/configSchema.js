import mongoose from 'mongoose'

const configSchema = mongoose.Schema({
    _immutable: {
        type: Boolean,
        default: true,
        required: true,
        unique: true,
        immutable: true
    },
    authCookie: String,
    twoCaptchaTokenApiKey: String
}, {
    collection: 'config',
    timestamps: true
})

export const Config = mongoose.model("Config", configSchema)