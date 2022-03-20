import Sellix from '@sellix/node-sdk'
const sellix = Sellix("RqxQrDBCFEu3iEEK9bg3eatgHGUn9YJA3kW6CI90Vj5zXLzoFstae1OJwTFWhsbX")

import { Key } from '../schemas/keySchema.js'
import { Country } from '../schemas/countrySchema.js'
import { Config } from '../schemas/configSchema.js'

                                                                                                                                                                                                                                                                                                                                                                                                                                                           
export async function getStats(req, res, next) {
    try {
        // const sellixOrders = await sellix.orders.list()
        // const totalOrders = await sellixOrders.length
        const allCountryData = await Country.find({})
        const totalKeys = await Key.countDocuments()
        const totalCountries = allCountryData.length
        let totalStock = 0
        allCountryData.filter((country) => {
            let stockLength = country.stock.length
            totalStock = totalStock + stockLength
        })

        return { totalCountries, totalKeys, totalStock }
    } catch(err) {
        return {success: false, error: err.message, stack: err}
    }
}


export async function updateConfig(req, res, next) {
    try {
        const {twoCaptchaTokenApiKey, discordServer, maxReplacements,replacementCooldown, spotifyLogin, contactLink} = req.query
        if (twoCaptchaTokenApiKey) await Config.updateOne({}, {twoCaptchaTokenApiKey})
        if (discordServer) await Config.updateOne({}, {discordServer})
        if (maxReplacements) await Config.updateOne({}, {maxReplacements})
        if (replacementCooldown) await Config.updateOne({}, {replacementCooldown})
        if (spotifyLogin) await Config.updateOne({}, {spotifyLogin})
        if (contactLink) await Config.updateOne({}, {contactLink})

        const config = await Config.find({}).select("-_id").select("-__v").select("-createdAt").select("-_immutable").select("-updatedAt")
        res.status(200).json({ success: true, message: "Succesfully updated", config: config[0]})
    } catch (err) {
        next(err)
    }
}