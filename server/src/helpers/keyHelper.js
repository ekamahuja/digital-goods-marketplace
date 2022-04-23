import {Key} from '../schemas/keySchema.js'
import randomKey from 'random-key'
import { sendDiscordWebhook } from "../utils/discordWebhook.js";

export async function generateKeys(prefix, type, amount) {
    try {
        let keyArray = []
        let savedKeys = []

        for (let i = 1; i <= amount; i++) {
            let key = `${prefix}-${randomKey.generateBase30(5)}-${randomKey.generateBase30(5)}-${randomKey.generateBase30(5)}`
            console.log(key)
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



export async function blacklistKeys(keys, sendWebhook = false) {
    try {

        const blacklistedKeys = [];

        for (let key of keys) {
            let item = await Key.findOne({ value: key });
            if (!item) continue;
            item.blacklisted = true
            await item.save();
            blacklistedKeys.push(item.value);
        }

        if (sendWebhook) {
            const discordTitle = `❌ Blacklisted ${blacklistedKeys.length} key(s)!`;
            const discordDesc = `Event: ${req.body.type}\n Product: ${paymentDocument.productName}\n Payment Method: ${paymentDocument.paymentMethod}\n Amount of Keys Blacklisted: ${blacklistedKeysAmount}\n Key(s): ${(blacklistedKeys.length > 50) ? `Blacklisted ${blacklistedKeys.length} keys (Too many to print)` : blacklistedKeys.join(", ")}\n Order ID: ${paymentDocument.orderId}\n Email: ${paymentDocument.customerEmail}\n  Reason: ${req.body.type} \nIP: ${paymentDocument.customerIp}\n Paid: $${paymentDocument.amountPaid} USD`;
            sendDiscordWebhook(discordTitle, 'discordDesc', "notification");
        }
        
        return blacklistedKeys

    } catch(err) {
        return {success: false, error: err}
    }
}

