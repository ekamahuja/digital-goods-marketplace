import SpotifyWebApi from 'spotify-web-api-node'
import { getStock, ipToCountryCode, countryCodeToCountry } from '../helpers/upgradeHelper.js'
import { spotifyUser } from '../helpers/replacementHelper.js'
import { Key } from '../schemas/keySchema.js'
import { upgradeLog } from '../schemas/upgradeLogSchema.js'
import { Config } from '../schemas/configSchema.js'




export async function getReplacement(req, res, next) {
  try {
    const config = await Config.findOne({})

    const { countryC } = req.body
    const { spotifyToken } = req.cookies
    if (!spotifyToken) throw new Error('Missing spotify bearer token')

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    const countryCode = (countryC) ? countryC : await ipToCountryCode(ip)
    if (!countryCode) throw new Error(`Please provide a valid country`)

    const user = await spotifyUser(spotifyToken)
    if (!user || user.error) throw new Error((user.error) ? `${user.error}` : "Could not fetch user details")
    if (!user.plan || user.plan !== "open") throw new Error('The account is already premium')

    const upgradeData  = await upgradeLog.findOne({email: user.email})
    if (!upgradeData) throw new Error("Account not found in database")

    const lastUpgradeTime = (new Date()).getTime() - (upgradeData.updatedAt).getTime()
    if (lastUpgradeTime < (config.replacementCooldown * 60000)) throw new Error("Not eligible for a replacement")

    const keyData = await Key.findOne({value: upgradeData.key})
    if (!keyData) throw new Error("Could not fetch key detatils")
    if (keyData.blacklisted) throw new Error('Your account is linked with a blacklisted key. Please contact staff for further detatils.')
    if (keyData.type == "onetime") throw new Error("One time use keys do not come with warranty")
    if (keyData.replacementsClaimed >= config.maxReplacements) throw new Error("The key has been locked. Please contact staff for further details.") 

    if (countryCode !== user.country) throw new Error("Please change your account's country to the country you live in")

    const upgradeInfo = await getStock(countryCode)
    if (upgradeInfo.error) throw new Error(upgradeInfo.error)

    keyData.replacementsClaimed ++
    keyData.totalReplacementsClaimed ++
    const updatedKeyData = await keyData.save()
    if (!updatedKeyData) throw new Error("Could not update key data")

    upgradeData.upgrades.push({
      inviteLink: upgradeInfo.inviteLink,
      inviteAddress: upgradeInfo.inviteAddress,
      inviteCountry: countryCode,
      userEmail: user.email,
      userIp: ip
    })
    const updatedUpgradeData = await upgradeData.save()

    const country = countryCodeToCountry(countryCode)


    res.status(200).json({
      success: true,
      message: "Successfully replaced",
      email: updatedUpgradeData.email,
      key: updatedKeyData.value,
      upgradeData: {
        inviteLink: upgradeInfo.inviteLink,
        inviteAddress: upgradeInfo.inviteAddress,
        inviteCountry: country
    }
  })

  } catch (err) {
    next(err)
  }
} 


