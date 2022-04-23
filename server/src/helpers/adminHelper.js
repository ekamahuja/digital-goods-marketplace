import Sellix from '@sellix/node-sdk'
const sellix = Sellix("RqxQrDBCFEu3iEEK9bg3eatgHGUn9YJA3kW6CI90Vj5zXLzoFstae1OJwTFWhsbX")

import { Key } from '../schemas/keySchema.js'
import { upgradeStock } from '../schemas/upgradeStockSchema.js'
import Payment from '../schemas/paymentSchema.js'

export async function getStats() {
    try {
        const allCountryData = await upgradeStock.find({})
        const totalKeys = await Key.countDocuments()
        const totalCountries = allCountryData.length
        let totalStock = 0
        allCountryData.filter((country) => {
            let stockLength = country.stock.length
            totalStock = totalStock + stockLength
        })
        const totalPayments = await Payment.countDocuments()

        return { totalCountries, totalKeys, totalStock, totalPayments }
    } catch(err) {
        return {success: false, error: err.message, stack: err}
    }
}




export async function getPaymentStats() {
    try {
        const payments = await Payment.find({})
        const totalPayments = payments.length
        let totalPaymentsRevenue = 0
        payments.map((item) => {
            totalPaymentsRevenue = totalPaymentsRevenue + item.amountPaid
        })

        const last24HourTotalPayments = await Payment.find({createdAt: {$gt: new Date(Date.now() - 86400000)}})
        const last24HourTotalPaymentsLength = last24HourTotalPayments.length
        let last24HourTotalPaymentsRevenue = 0
        last24HourTotalPayments.map((item) => {
            last24HourTotalPaymentsRevenue = last24HourTotalPaymentsRevenue + item.amountPaid
        })

        return {totalPayments, totalPaymentsRevenue, last24HourTotalPaymentsLength, last24HourTotalPaymentsRevenue}
    } catch (err) {
        console.log(err)
        return {success: false, error: err.message, stack: err}
    }
}