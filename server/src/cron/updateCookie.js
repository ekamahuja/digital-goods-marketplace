import cron from 'cron'
import { cookie } from '../helpers/getCookies.js'
import { Config } from '../schemas/configSchema.js'
const CronJob = cron.CronJob


export const updateAuthCookie = new CronJob('0 0 * * *', async function() {
    try {
        consola.info("Updating Auth Cookies")
        const newAuthCookie = await cookie()
        const updatedCookie = await Config.updateOne({}, {authCookie: newAuthCookie})
        if (updatedCookie.modifiedCount == 1) {
            consola.success("Auth Cookies updated successfully")
        } else {
            throw new Error("Auth Cookies update failed")
        }
    } catch (err) {
        consola.error(err)
    }
})


updateAuthCookie.start()