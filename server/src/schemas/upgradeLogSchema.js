import mongoose from 'mongoose'


const upgradeLogSchema = mongoose.Schema({
    email: {
        type: String,
        required: "Please provide the email address to the upgrade log"
    },
    key: {
        type: String,
        required: "Please provide the key to the upgrade log",
        maxLength: 1024
    },
    upgrades: [{
        inviteLink: {
            type: String,
            required: "inviteLink is missing"
        },
        inviteAddress: {
            type: String,
            required: "inviteAddress is missing"
        },
        inviteCountry: {   
            type: String,
            required: "inviteCountry is missing"
        },
        userIp: {
            type: String,
            required: "userIp is missing"
        }
    }]
}, {
    timestamps: true
})


export const upgradeLog = mongoose.model('upgradeLog', upgradeLogSchema)