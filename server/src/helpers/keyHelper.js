import {Key} from '../schemas/keySchema.js'
import randomKey from 'random-key'
import { sendDiscordWebhook } from "../utils/discordWebhook.js";
import Payment from "../schemas/paymentSchema.js";

export async function generateKeys(prefix, type, amount) {
    try {
        let keyArray = []
        let savedKeys = []

        for (let i = 1; i <= amount; i++) {
            let key = `${prefix}-${randomKey.generateBase30(5)}-${randomKey.generateBase30(5)}-${randomKey.generateBase30(5)}`
            keyArray.push({ value: key.toUpperCase(), type })
        }
        
        let generatedKeys = await Key.insertMany(keyArray)
        if (!generatedKeys) throw new Error("Could not save keys to the database")

        generatedKeys.forEach(key => {
            savedKeys.push(key.value)
        })

        return savedKeys
    } catch(err) {
        return {success: false, error: err}
    }
}



export async function blacklistKeys(keys) {
    try {
        const blacklistedKeys = [];

        for (let key of keys) {
            let item = await Key.findOne({ value: key });
            if (!item) continue;

            item.blacklisted = true
            await item.save();

            blacklistedKeys.push(item.value);
        }

        return blacklistedKeys

    } catch(err) {
        return {success: false, error: err}
    }
}




export const blacklistAllOrdersByEmail = async (email) => {
    const orders = await Payment.find({ customerEmail: email })
    const keys = []
    for (const order of orders) {
        if (order.status === "completed") {
            order.status = "dispute-blacklisted"
            await order.save();
            keys.push(order.deliveredGoods)
        }
        
    }

    await blacklistKeys(keys)
}