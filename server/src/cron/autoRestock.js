import cron from 'cron'
import { Config } from '../schemas/configSchema.js'
import { Country } from '../schemas/countrySchema.js'
import { checkInviteLink } from '../helpers/upgradeHelper.js'
import { usedStock } from '../schemas/usedStock.js'

const CronJob = cron.CronJob




const checkUsedStock = new CronJob('0 */5 * * * ', async function() {
    consola.info("Rechecking used Stocks")
    try {
        const getCookie = (await Config.findOne({}, 'authCookie')).authCookie
        const getUsedStocks = await usedStock.find({})
        let validStockAmount = 0

        for (let i = 0; i < getUsedStocks.length; i++) {
            const isValid = await checkInviteLink(getCookie, getUsedStocks[i].inviteLink)
            if (isValid) {
                const countryCode = await Country.updateOne({countryCode: getUsedStocks[i].countryCode}, {$push: {stock: {inviteLink: getUsedStocks[i].inviteLink, inviteAddress: getUsedStocks[i].inviteAddress}}})
                validStockAmount++
            }
            await usedStock.deleteOne({_id: getUsedStocks[i]._id})
        }

        consola.success(`Rechecked used Stocks! Added ${validStockAmount} stocks`)
    } catch (err) {
        consola.error(err)
    }
})



export default checkUsedStock