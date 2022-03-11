import cron from 'cron'
import { Config } from '../schemas/configSchema.js'
import { Country } from '../schemas/countrySchema.js'
import { checkInviteLink } from '../helpers/upgradeHelper.js'
import { autoRestock } from '../schemas/autoRestockSchema.js'

const CronJob = cron.CronJob




const checkUsedStock = new CronJob('0 */5 * * * ', async function() {
    consola.info("Rechecking used Stocks")
    try {
        const getCookie = (await Config.findOne({}, 'authCookie')).authCookie
        const usedStocks = await autoRestock.find({})
        let validStockAmount = 0

        for (let i = 0; i < usedStocks.length; i++) {
            const isValid = await checkInviteLink(getCookie, usedStocks[i].inviteLink)
            if (isValid) {
                const countryCode = await Country.updateOne({countryCode: usedStocks[i].countryCode}, {$push: {stock: {inviteLink: usedStocks[i].inviteLink, inviteAddress: usedStocks[i].inviteAddress}}})
                validStockAmount++
            }
            await autoRestock.deleteOne({_id: usedStocks[i]._id})
        }

        consola.success(`Rechecked used Stocks! Added ${validStockAmount} stocks`)
    } catch (err) {
        consola.error(err)
    }
})



export default checkUsedStock