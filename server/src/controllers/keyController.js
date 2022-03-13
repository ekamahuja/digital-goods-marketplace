import randomKey from 'random-key'
import { Key } from '../schemas/keySchema.js'
import { upgradeLog } from '../schemas/upgradeLogSchema.js'

export async function generateKeys(req, res) {
    const {prefix, type, amount} = req.body
    if (!prefix || !type || !amount || prefix.length < 3 || type.length < 4 || typeof amount !== 'number') return res.status(400).json({success: false, error: 'Invalid params'})

    try {
        let keyArray = []
        for (let i = 1; i <= parseInt(amount); i++) {
            let key = `${prefix}-${randomKey.generateBase30(5)}-${randomKey.generateBase30(5)}-${randomKey.generateBase30(5)}`
            keyArray.push({ value: key.toUpperCase(), type })
        }

        let generatedKeys = await Key.insertMany(keyArray)
        if (!generatedKeys) return res.status(201).json({ success: false, message: 'Keys could not be saved to database'})

        generatedKeys = generatedKeys.map((key) => ({
            _id: key._id,
            value: key.value,
            type: key.type,
        }))

        return res.status(201).json({ success: true, amountOfKeys: generatedKeys.length, keys: generatedKeys})
    } catch (err) {
        consola.error(err.message)
        return res.status(500).json({success: false, error: err.message, stack: err})
    }
}



export async function getKeyInfo(req, res) {
    const key = req.query.key
    if (!key) return res.status(400).json({success: false, error: 'Key missing'})
    
    try {
        const keyInfo = await Key.findOne({value: key}).select("-__v").select("-createdAt").select("-upd atedAt")
        if (!keyInfo) return res.status(404).json({success: false, error: 'Key not found'})

        return res.status(200).json({ success: true, message: 'Successfully retrieved key', keyInfo})
    } catch (err) {
        consola.error(err)
        return res.status(500).json({success: false, error: err.message, stack: err})
    }
}



export async function getKeys(req, res) {
    const page = parseInt(req.query.page) || 0

    const documentPerLimit = parseInt(process.env.PAGE_LIMIT)
    const totalKeys = await Key.countDocuments()
    const totalPages = Math.ceil(totalKeys / documentPerLimit)

    const keys = await Key.find({}).limit(documentPerLimit).skip(documentPerLimit * page).select("-createdAt").select("-updatedAt").select("-__v")
    if (!keys) return res.status(404).json({success: false, error: 'Keys could not be fetched'})
    if (keys.length == 0) return res.status(404).json({ success: true, message: "No keys exist or Invalid page"})

    return res.status(200).json({success: true, keysOnThisPage: keys.length, totalKeys, totalPages, keys})
}



export async function unlockKey(req, res) {
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
        consola.error(err)
        return res.status(500).json({success: false, error: err.message, stack: err})
    }
}
