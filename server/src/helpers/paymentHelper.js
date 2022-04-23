import fetch from 'node-fetch'
import randomKey from 'random-key'
import ipInfo from '../schemas/ipInfoSchema.js'
import { sendDiscordWebhook } from '../utils/discordWebhook.js'


export const calculateFees = (paymentMethod, amount) => {
    if (paymentMethod == 'stripe') {
        let fee = 0;
        fee = (amount * 0.029) + 0.30
        return fee
    }
    return 0.00
}


export const generateOrderId = () => {
    const id = randomKey.generate(18)
    return id
}



export const fetchIpData = async (ip, useragent) => {
    try {
        const {IPQUALITYSCORE_API_KEY} = process.env

        const request = await fetch(`https://ipqualityscore.com/api/json/ip/${IPQUALITYSCORE_API_KEY}/${ip}?strictness=0&allow_public_access_points=true&allow_public_access_points=true&lighter_penalties=true&user_agent=${useragent};`)
        const response = await request.json()

        return response
    } catch(err) {
        return {success: false, message: err.message}
    }
}




export const getIpData = async (ip, useragent = null) => {
    try {
        const ipDataFromDataBase = await ipInfo.findOne({ip})
        if (ipDataFromDataBase) return ipDataFromDataBase

        const ipData = await fetchIpData(ip, useragent)
        if (!ipData.success) throw new Error(ipData.message)

        const data = {
            ip: ip,
            fraudScore: ipData.fraud_score,
            countryCode: ipData.country_code,
            region: ipData.region,
            city: ipData.city,
            isp: ipData.ISP,
            asn: ipData.ASN,
            operatingSystem: ipData.operating_system,
            browser: ipData.browser,
            organization: ipData.organization,
            isCrawler: ipData.is_crawler,
            timezone: ipData.timezone,
            mobile: ipData.mobile,
            host: ipData.host,
            proxy: ipData.proxy,
            vpn: ipData.vpn,
            tor: ipData.tor,
            activeVpn: ipData.active_vpn,
            activeTor: ipData.active_tor,
            deviceBrand: ipData.device_brand,
            deviceModel: ipData.device_model,
            recentAbsuse: ipData.recent_abuse,
            botStatus: ipData.bot_status,
            zipCode: ipData.zip_code,
            latitude: ipData.latitude,
            longitude: ipData.longitude,
            requestId: ipData.request_id
        }

        const savedIpData = await ipInfo.create(data)
        return savedIpData
    } catch(err) {
        sendDiscordWebhook(':x: Error Occured!', `Info: An error occured while fetching IP Info.\n Error Message: ${err.message}\n Error Stack: ${err.stack}`,  'error')
        return {success: false, message: err.message}
    }
}

