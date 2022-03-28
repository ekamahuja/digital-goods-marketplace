import express from 'express';
const adminRoutes = express();
import { adminApiOnly } from "../middlewares/apiRouteProtection.js"
import { getStats, updateConfig } from '../controllers/adminController.js'



adminRoutes.get('/stats', adminApiOnly, getStats)
adminRoutes.post('/config', adminApiOnly, updateConfig)



export default adminRoutes