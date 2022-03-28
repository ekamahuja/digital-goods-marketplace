import express from 'express'
const keyRoutes = express.Router()
import { adminApiOnly, adminAndModeratorApiOnly } from '../middlewares/apiRouteProtection.js'
import { generateKeys, getKeyInfo, getKeys, unlockKey, changeKeyEmail, blacklistKeys } from '../controllers/keyController.js'




keyRoutes.post('/keys', adminApiOnly, generateKeys)
// keyRoutes.get('/keys', adminOnly, getKeys) // Not being used
keyRoutes.get('/key', getKeyInfo)
keyRoutes.get('/unlockkey', adminAndModeratorApiOnly, unlockKey)
keyRoutes.get('/updateemail', adminAndModeratorApiOnly, changeKeyEmail)
keyRoutes.post('/blacklistkeys', adminAndModeratorApiOnly, blacklistKeys)




export default keyRoutes