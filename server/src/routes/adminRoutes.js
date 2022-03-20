import express from 'express';
const adminRoutes = express();

import {getStats, updateConfig} from '../controllers/adminController.js'



adminRoutes.get('/stats', getStats)
adminRoutes.post('/config', updateConfig)



export default adminRoutes