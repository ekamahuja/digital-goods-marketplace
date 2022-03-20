import Sellix from '@sellix/node-sdk'
const sellix = Sellix("RqxQrDBCFEu3iEEK9bg3eatgHGUn9YJA3kW6CI90Vj5zXLzoFstae1OJwTFWhsbX")

import { Key } from '../schemas/keySchema.js'
import { Country } from '../schemas/countrySchema.js'

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