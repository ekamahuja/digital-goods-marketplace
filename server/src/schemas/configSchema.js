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
    twoCaptchaTokenApiKey: String,
    discordServer: String,
    maxReplacements: Number,
    replacementCooldown: Number,
    spotifyLogin: String,
    contactLink: String,
    affilateMinimumPayout: Number
}, {
    collection: 'config',
    timestamps: true
})

export const Config = mongoose.model("Config", configSchema)