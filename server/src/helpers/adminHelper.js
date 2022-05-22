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
        const payments = await Payment.find({ $and: [{status: {$eq: "completed"}}] })
        const totalPayments = payments.length
        
        let totalPaymentsRevenue = 0
        let stripeFees = 0
        let coinbaseFees = 0
        let stripeRevenue = 0
        let coinbaseRevenue = 0

        payments.map((item) => {
            totalPaymentsRevenue = totalPaymentsRevenue + item.amountPaid

            if (item.paymentMethod == "stripe") {
                stripeRevenue = stripeRevenue + item.amountPaid
                stripeFees = stripeFees + item.fee
            } else if (item.paymentMethod == "coinbase") {
                coinbaseRevenue = coinbaseRevenue + item.amountPaid
                coinbaseFees =  coinbaseFees + item.fee
            }
        })

        const last24HourTotalPayments = await Payment.find({createdAt: {$gt: new Date(Date.now() - 86400000) }, $and: [{status: {$eq: "completed"}}]})
        const last24HourTotalPaymentsLength = last24HourTotalPayments.length
        let last24HourTotalPaymentsRevenue = 0
        last24HourTotalPayments.map((item) => {
            last24HourTotalPaymentsRevenue = last24HourTotalPaymentsRevenue + item.amountPaid
        })

        return {totalPayments, totalPaymentsRevenue, last24HourTotalPaymentsLength, last24HourTotalPaymentsRevenue, stripeFees, coinbaseFees, stripeRevenue, coinbaseRevenue}
    } catch (err) {
        console.log(err)
        return {success: false, error: err.message, stack: err}
    }
}