import randomKey from 'random-key'
import validator from 'validator';
import { Key } from '../schemas/keySchema.js'
import { upgradeLog } from '../schemas/upgradeLogSchema.js'
import { countryCodeToCountry } from '../helpers/upgradeHelper.js'
import { Config } from '../schemas/configSchema.js'


export async function generateKeys(req, res, next) {
    try {
        const {prefix, type, amount} = req.body
        if (!prefix || !type || !amount || prefix.length < 3 || type.length < 4 || typeof amount !== 'number') throw new Error("Invalid params")
    
        let keyArray = []
        let savedKeys = []
        for (let i = 1; i <= parseInt(amount); i++) {
            let key = `${prefix}-${randomKey.generateBase30(5)}-${randomKey.generateBase30(5)}-${randomKey.generateBase30(5)}`
            keyArray.push({ value: key.toUpperCase(), type })
        }

        let generatedKeys = await Key.insertMany(keyArray)
        if (!generatedKeys) throw new Error("Could not save keys to the database")

        generatedKeys.forEach(key => {
            savedKeys.push(key.value)
        })

        return res.status(201).json({ success: true, message: `Successfully generated ${generatedKeys.length} ${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} keys`, amountOfKeys: generatedKeys.length, typeOfKeys: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),keys: savedKeys})
    } catch (err) {
        next(err)
    }
}



export async function getKeyInfo(req, res, next) {
    try {
        const {key, adminData} = req.query
        if (!key) throw new Error("Key missing")

        const keyInfo = await Key.findOne({value: key}).select("-__v").select("-createdAt").select("-updatedAt")
        if (!keyInfo) {
            res.status(404)
            throw new Error("Key not found")
        }

        if (keyInfo.blacklisted) throw new Error("Key has been blacklisted")
        console.log(keyInfo.blacklisted)
        const keyUpgradeData = (keyInfo.used) ? await upgradeLog.findOne({key: keyInfo.value}) : null
        
        let keyData

        if (!keyUpgradeData) {
            keyData = {
                key,
                type: keyInfo.type,
                used: keyInfo.used,
            }
        } else {
            if (adminData) {
                if (req.user && req.user.role == 'admin') {
                    keyData = {
                        key,
                        email: keyUpgradeData.email,
                        used: keyInfo.used,
                        type: keyInfo.type,
                        replacementsClaimed: keyInfo.replacementsClaimed,
                        totalReplacementsClaimed: keyInfo.totalReplacementsClaimed,
                        upgradeData: keyUpgradeData
                    }
                } else {
                    throw new Error("Invalid session")
                }
            } else {
                let country =  await countryCodeToCountry(keyUpgradeData.upgrades[keyUpgradeData.upgrades.length - 1].inviteCountry)
                country = (country.success) ? keyUpgradeData.upgrades[keyUpgradeData.upgrades.length - 1].inviteCountry : country

                keyData = {
                    key,
                    email: keyUpgradeData.email,
                    used: keyInfo.used,
                    type: keyInfo.type,
                    totalReplacementsClaimed: keyInfo.totalReplacementsClaimed,
                    lastUpgrade: [keyUpgradeData.upgrades[keyUpgradeData.upgrades.length -1]].map((upgradeInfo) => {
                        return {
                            inviteLink: upgradeInfo.inviteLink,
                            inviteAddress: upgradeInfo.inviteAddress,
                            inviteCountry: country
                        }
                    })[0]
                }
            }
            
            
        }
        
        return res.status(200).json({ success: true, message: 'Successfully retrieved key', keyData })
    } catch (err) {
        next(err)
    }
}



export async function getKeys(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 0

        const documentPerLimit = parseInt(process.env.PAGE_LIMIT)
        const totalKeys = await Key.countDocuments()
        const totalPages = Math.ceil(totalKeys / documentPerLimit)

        const keys = await Key.find({}).limit(documentPerLimit).skip(documentPerLimit * page).select("-createdAt").select("-updatedAt").select("-__v")
        if (!keys) throw new Error('Keys could not be fetched')
        if (keys.length == 0) throw new Error("No keys exist or Invalid page")

        return res.status(200).json({success: true, keysOnThisPage: keys.length, totalKeys, totalPages, keys})
    } catch(err) {
        next(err)
    }
}



export async function unlockKey(req, res, next) {
    try {
        const {key} = req.query
        if (!key) throw new Error("Key missing")

    
        const keyInfo = await Key.findOne({value: key}).select("-__v").select("-createdAt").select("-updatedAt")
        if (!keyInfo) throw new Error("Key not found")
        if (!keyInfo.used) throw new Error("Key has not been used")

        const config = await Config.findOne({})
        if (!config) throw new Error("Config not found")

        if (keyInfo.replacementsClaimed <= config.maxReplacements - 1) throw new Error("Key is not locked")

        keyInfo.replacementsClaimed = 0;

        const resetKey = await keyInfo.save()
        
        return res.status(200).json({ success: true, message: 'Key successfully unlocked', key: resetKey})
    } catch (err) {
        next(err)
    }
}


export async function changeKeyEmail(req, res, next) {
    try {
        const {key, email} = req.query
        if (!key || !email) throw new Error("Missing key or email")
        if (!validator.isEmail(email)) throw new Error(`Invalid email address`)

        const keyInfo = await Key.findOne({value: key}).select("-__v").select("-createdAt").select("-updatedAt")
        if (!keyInfo) throw new Error("Key not found")
        if (!keyInfo.used) throw new Error("Key has not been used")

        const upgradeData = await upgradeLog.findOne({key})
        if (!upgradeData) throw new Error("Something went wrong")

        upgradeData.email = email.toLowerCase()
        const savedUpgradeData = await upgradeData.save()
        if (!savedUpgradeData) throw new Error(`Could not change the email on ${upgradeData.key}`)

        return res.status(201).json({success: true, message: `Email updated it to ${savedUpgradeData.email}`})

    } catch(err) {
        next(err)
    }
}



export async function blacklistKeys(req, res, next) {
    try {
        const {keys} = req.body
        if (!keys) throw new Error("No key(s) provided")

        let successfullBlacklistedAmount= 0


        for (let i = 0; i < keys.length; i++) {
            let keyData = await Key.findOne({value: keys[i]})

            if (keyData) {
                keyData.blacklisted = true
                await keyData.save()
                successfullBlacklistedAmount++
            }
        }

        return res.status(200).json({success: true, message: `Successfully blacklisted ${successfullBlacklistedAmount} key(s)`})

    } catch(err) {
        next(err)
    }
}