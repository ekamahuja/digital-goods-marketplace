import express from 'express'
const keyRoutes = express.Router()
import { requireUser } from '../middlewares/requireUser.js'
import { generateKeys, getKeyInfo, getKeys, unlockKey } from '../controllers/keyController.js'




keyRoutes.post('/keys', requireUser, generateKeys)
keyRoutes.get('/keys', requireUser, getKeys)
keyRoutes.get('/key', getKeyInfo)
keyRoutes.post('/unlockkey', requireUser, unlockKey)




export default keyRoutes