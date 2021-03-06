import express from 'express'
const keyRoutes = express.Router()
import { adminApiOnly, adminAndModeratorApiOnly } from '../middlewares/apiRouteProtection.js'
import { generateKeys, getKeyInfo, getKeys, unlockKey, changeKeyEmail, updateKeyStatus, generateVpn } from '../controllers/keyController.js'




keyRoutes.post('/keys', adminApiOnly, generateKeys)
// keyRoutes.get('/keys', adminOnly, getKeys) // Not being used
keyRoutes.get('/key', getKeyInfo)
keyRoutes.get('/unlockkey', adminAndModeratorApiOnly, unlockKey)
keyRoutes.get('/updateemail', adminAndModeratorApiOnly, changeKeyEmail)
keyRoutes.post('/updatekeyStatus', adminApiOnly, updateKeyStatus)
keyRoutes.post('/generate-vpn', generateVpn)



export default keyRoutes