// Import packages and files
import express from 'express';
import authRoutes from './authRoutes.js'
import stockRoutes from './countryRoutes.js'
import keyRoutes from './keyRoutes.js'
import upgradeRoutes from './upgradeRoutes.js'
import replacementRoutes from './replacementRoutes.js'
import viewRoutes from './viewRoutes.js'
import sellixRoutes from './sellixRoutes.js'
import adminRoutes from './adminRoutes.js'
import { apiKeyLimiter, apiStockLimiter, apiLimiter } from '../middlewares/rateLimiting.js'

const app = express();

function routes(app) {

    app.use('/', viewRoutes);
    
    app.use('/api/auth', authRoutes);

    app.use('/api/data', apiStockLimiter, stockRoutes);

    app.use('/api/',  apiKeyLimiter, keyRoutes);

    app.use('/api/', apiLimiter, upgradeRoutes);

    app.use('/api/', apiLimiter, replacementRoutes)

    app.use('/api/', sellixRoutes)

    app.use('/admin/api', adminRoutes);
    
}


// Export all routes
export default routes