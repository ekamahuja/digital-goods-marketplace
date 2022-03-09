import express from 'express';
import { requireUser } from '../middlewares/requireUser.js'
import { upgradeUser } from '../controllers/upgradeController.js'
const upgradeRoutes = express.Router()



upgradeRoutes.post('/upgrade', upgradeUser)



export default upgradeRoutes