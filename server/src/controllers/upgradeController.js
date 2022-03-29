import validator from 'validator';
import { Key } from '../schemas/keySchema.js'
import { getStock, ipToCountryCode } from '../helpers/upgradeHelper.js'
import { upgradeLog } from '../schemas/upgradeLogSchema.js'


export async function upgradeUser(req, res, next) {
    try {
        const { email, key, countryC } = req.body
        if (!email || !key) throw new Error("Missing params")
        if (!validator.isEmail(email)) throw new Error(`Invalid email address`)

        const keyData = await Key.findOne({value: key})
        if (!keyData) throw new Error(`Invalid key (${key})`)
        if (keyData.blacklisted) throw new Error('This is a blacklisted key')
        if (keyData.used) throw new Error(`This key is already used`)

        const emailAlreadyUsed = await upgradeLog.findOne({email})
        if (emailAlreadyUsed) throw new Error(`The email is already linked with another key`)

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const countryCode = (countryC) ? countryC : await ipToCountryCode(ip)
        if (!countryCode) throw new Error(`Please provide a valid country`)
        
        const upgradeInfo = await getStock(countryCode)
        if (upgradeInfo.error) throw new Error(upgradeInfo.error)

        const successfulLog = await upgradeLog.create({
            email,
            key: keyData.value,
            upgrades: [{
                inviteLink: upgradeInfo.inviteLink,
                inviteAddress: upgradeInfo.inviteAddress,
                inviteCountry: countryCode,
                userEmail: email,
                userIp: ip
            }]
        })
        if (!successfulLog) throw new Error("Upgrade failed")

        keyData.used = true
        const usedKey = await keyData.save()
        if (!usedKey) throw new Error("Upgrade failed")


        res.status(200).json({
            success: true,
            message: "Successfully upgraded",
            key: keyData.value,
            upgradeData: {
                inviteLink: upgradeInfo.inviteLink,
                inviteAddress: upgradeInfo.inviteAddress,
                inviteCountry: upgradeInfo.country
            }
        })
    } catch (err) {
        return next(err)
    }
    
}