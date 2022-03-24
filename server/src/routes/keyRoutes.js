import express from 'express'
const keyRoutes = express.Router()
import { requireUser } from '../middlewares/requireUser.js'
import { generateKeys, getKeyInfo, getKeys, unlockKey, changeKeyEmail } from '../controllers/keyController.js'




keyRoutes.post('/keys', requireUser, generateKeys)
keyRoutes.get('/keys', requireUser, getKeys)
keyRoutes.get('/key', getKeyInfo)
keyRoutes.get('/unlockkey', requireUser, unlockKey)
keyRoutes.get('/updateemail', requireUser, changeKeyEmail)




export default keyRoutes