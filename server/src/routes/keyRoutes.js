import express from 'express'
const keyRoutes = express.Router()
import { adminOnly } from '../middlewares/adminOnly.js'
import { generateKeys, getKeyInfo, getKeys, unlockKey, changeKeyEmail, blacklistKeys } from '../controllers/keyController.js'




keyRoutes.post('/keys', adminOnly, generateKeys)
// keyRoutes.get('/keys', adminOnly, getKeys) // Not being used
keyRoutes.get('/key', getKeyInfo)
keyRoutes.get('/unlockkey', adminOnly, unlockKey)
keyRoutes.get('/updateemail', adminOnly, changeKeyEmail)
keyRoutes.post('/blacklistkeys', adminOnly, blacklistKeys)




export default keyRoutes