import mongoose from 'mongoose'


const ipInfoSchema = mongoose.Schema({
    ip: {
        type: String,
        unique: true,
        required: true
    },
    fraudScore: {
        type: Number,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    isp: {
        type: String,
        required: true
    },
    asn: {
        type: Number,
        required: true
    },
    operatingSystem: {
        type: String,
        required: true
    },
    browser: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    isCrawler: {
        type: Boolean,
        required: true
    },
    timezone: {
        type: String,
        required: false
    },
    mobile: {
        type: Boolean,
        required: true
    },
    host: {
        type: String,
        required: true
    },
    proxy: {
        type: Boolean,
        required: true
    },
    vpn: {
        type: Boolean,
        required: true
    },
    tor: {
        type: Boolean,
        required: true
    },
    activeVpn: {
        type: Boolean,
        required: true
    },
    activeTor: {
        type: Boolean,
        required: true
    },
    deviceBrand: {
        type: String,
        required: true
    },
    deviceModel: {
        type: String,
        required: true
    },
    recentAbsuse: {
        type: Boolean,
        required: true
    },
    botStatus: {
        type: Boolean,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    requestId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


const ipInfo = mongoose.model('ipInfo', ipInfoSchema)

export default ipInfo;

