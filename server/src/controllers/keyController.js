import randomKey from 'random-key'
import { Key } from '../schemas/keySchema.js'


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