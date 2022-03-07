import express from 'express'
const keyRoutes = express.Router()
import { requireUser } from '../middlewares/requireUser.js'
import { generateKeys } from '../controllers/keyController.js'




keyRoutes.post('/keys', requireUser, generateKeys)





export default keyRoutes