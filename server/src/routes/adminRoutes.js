import express from 'express';
const adminRoutes = express();
import { adminApiOnly } from "../middlewares/apiRouteProtection.js"
import { updateConfig } from '../controllers/adminController.js'



adminRoutes.post('/config', adminApiOnly, updateConfig)



export default adminRoutes