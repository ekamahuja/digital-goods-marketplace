import SpotifyWebApi from 'spotify-web-api-node'
import { getStock, ipToCountryCode } from '../helpers/upgradeHelper.js'
import { spotifyUser } from '../helpers/replacementHelper.js'
import { Key } from '../schemas/keySchema.js'
import { upgradeLog } from '../schemas/upgradeLogSchema.js'

export async function createSpotifyAuthUrl(req, res) {
  const scopes = ['user-read-email', 'user-read-private']
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const state = 'replacement'
  const showDialog = true
  const responseType = 'token'

  const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    redirectUri: `${process.env.SERVER_URL}/api/spotify/oauth`
  })  

  const authUrl = spotifyApi.createAuthorizeURL(
    scopes,
    state,
    showDialog,
    responseType
  )

  res.redirect(authUrl)
}


export async function getReplacement(req, res, next) {
  try {
    const { countryC } = req.body
    // const spotifyToken = req.query.access_token
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

    const keyData = await Key.findOne({value: upgradeData.key})
    if (!keyData) throw new Error("Could not fetch key detatils")
    if (keyData.replacementsClaimed >= process.env.MAX_REPLACEMENTS) throw new Error("The key has been locked. Please contact staff for further details") 

    if (countryCode !== user.country) throw new Error("Please change your account's country to the country you live in")

    keyData.replacementsClaimed ++
    const updatedKeyData = await keyData.save()
    if (!updatedKeyData) throw new Error("Could not update key data")

    const upgradeInfo = await getStock(countryCode)
    if (!upgradeInfo || upgradeInfo.error) throw new Error((upgradeInfo.error) ? `${upgradeInfo.error}` : "Could not get upgrade data") 

    upgradeData.upgrades.push({
      inviteLink: upgradeInfo.inviteLink,
      inviteAddress: upgradeInfo.inviteAddress,
      inviteCountry: countryCode,
      userIp: ip
    })
    const updatedUpgradeData = await upgradeData.save()

    res.status(200).json({
      success: true,
      email: updatedUpgradeData.email,
      key: updatedKeyData.value,
      upgradeData: {
        inviteLink: upgradeInfo.inviteLink,
        inviteAddress: upgradeInfo.inviteAddress,
        inviteCountry: countryCode
    }
    })

  } catch (err) {
    next(err)
  }
} 