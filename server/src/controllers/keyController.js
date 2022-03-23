import randomKey from 'random-key'
import { Key } from '../schemas/keySchema.js'
import { upgradeLog } from '../schemas/upgradeLogSchema.js'
import { countryCodeToCountry } from '../helpers/upgradeHelper.js'

export async function generateKeys(req, res, next) {
    const {prefix, type, amount} = req.body
    if (!prefix || !type || !amount || prefix.length < 3 || type.length < 4 || typeof amount !== 'number') throw new Error("Invalid params")

    try {
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
    const key = req.query.key
    if (!key) return res.status(400).json({success: false, error: 'Key missing'})
    
    try {
        const keyInfo = await Key.findOne({value: key}).select("-__v").select("-createdAt").select("-updatedAt")
        if (!keyInfo) return res.status(404).json({success: false, message: 'Key not found'})
        
        const keyUpgradeData = (keyInfo.used) ? await upgradeLog.findOne({key: keyInfo.value}) : null
        
        let keyData

        if (!keyUpgradeData) {
            keyData = {
                key,
                type: keyInfo.type,
                used: keyInfo.used,
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
    const {key} = req.body
    if (!key) return res.status(400).json({success: false, error: 'Key missing'})

    try {
        const keyInfo = await Key.findOne({value: key}).select("-__v").select("-createdAt").select("-updatedAt")
        if (!keyInfo) return res.status(404).json({success: false, error: 'Key not found'})

        if (keyInfo.replacementsClaimed <= 5) return res.status(200).json({success: false, message: "Key is not locked"})

        keyInfo.replacementsClaimed = 0;
        keyInfo.amountOfResets++ 

        const resetKey = await keyInfo.save()
        
        return res.status(200).json({ success: true, message: 'Key successfully unlock', key: resetKey})
    } catch (err) {
        next(err)
    }
}
