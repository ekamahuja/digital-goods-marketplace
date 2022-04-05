import {upgradeStock} from '../schemas/upgradeStockSchema.js'
import {cookie} from './getCookies.js'
import fetch from 'node-fetch'
import {Config} from '../schemas/configSchema.js'
import { usedStock } from '../schemas/usedStock.js'
import countryMap from '../config/countryMap.js'


export const getStock = async (countryCode) => {
    try {
        if (countryCode.length !== 2) throw new Error("Invalid country code provided")

        const country = await upgradeStock.findOne( { countryCode })
        if (!country) throw new Error('Country does not exist')

        const stock = (country) ? country.stock : null
        if (!stock) throw new Error("No stock avaliable")

        let validStock = false
        let i = 0
        let amountOfFails = 0
        let inviteLink, inviteAddress
        const authCookie = (await Config.findOne({}, 'authCookie')).authCookie
        

        while (!validStock) {
             if (amountOfFails >= 10) {
                validStock = true
                throw new Error(`Upgrade unsuccessful, please try again later`)
            }

            if (i >= stock.length) {
                validStock = true
                throw new Error(`Ran out of stock for ${countryCodeToCountry(countryCode)}`)
            }
            
            let stockId = stock[i]._id
            inviteLink = stock[i].inviteLink
            inviteAddress = stock[i].inviteAddress

            validStock = await checkInviteLink(authCookie, inviteLink)

            await upgradeStock.updateOne({ countryCode }, {"$pull": {stock: {"_id": stockId}}})
            amountOfFails++
            i++
        }

        const createUsedStock = await usedStock.create({ inviteLink, inviteAddress, countryCode })
        if (!createUsedStock) throw new Error("Auto stock could not be created")

        return {
            country: country.name,
            inviteLink,
            inviteAddress
        }
        

    } catch (err) {
        return {success: false, error: err.message, stack: err}
    }

}


export const checkInviteLink = async (cookie, inviteLink) => {
   
        const requestUrl = inviteLink.replace("https://www.spotify.com/us/family/join/invite/", "https://www.spotify.com/api/family/v1/family/invite/")
        const headers = {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-GB,en;q=0.9",
            "cache-control": "max-age=0",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": cookie
        }

        const options = {
            headers,
            referrerPolicy: "strict-origin-when-cross-origin",
            method: "GET",
            body: null
        }

        const request = await fetch(requestUrl, options)
        const response = await request.json()
        if (response.homeId) {
            return true
        } else {
            // this should be false in production
            return false
        }
    
}


export async function ipToCountryCode(ip) {
    try {
        const request = await fetch(`https://ipapi.co/${ip}/json`)
        const response = await request.json();
        return response.country_code
    } catch (err) {
        return {success: false, error: err.message, stack: err}
    }
}


export function countryCodeToCountry(countryCode) {
    return countryMap[countryCode] || countryCode
}
