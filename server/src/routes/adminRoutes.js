import express from 'express';
const adminRoutes = express();
import { adminOnly } from "../middlewares/adminOnly.js";
import {getStats, updateConfig} from '../controllers/adminController.js'



adminRoutes.get('/stats', adminOnly, getStats)
adminRoutes.post('/config', adminOnly, updateConfig)



export default adminRoutes