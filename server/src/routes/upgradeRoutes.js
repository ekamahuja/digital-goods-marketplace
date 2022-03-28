import express from 'express';
import { upgradeUser } from '../controllers/upgradeController.js'
const upgradeRoutes = express.Router()



upgradeRoutes.post('/upgrade', upgradeUser)



export default upgradeRoutes