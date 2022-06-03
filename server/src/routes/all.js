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
import paymentRoutes from './paymentRoutes.js'
import productRoutes from './productRoutes.js'  
import affilateRoutes from './affilateRoutes.js'

const app = express();

function routes(app) {

    app.use('/', viewRoutes);
    
    app.use('/api/auth', authRoutes);

    app.use('/api/data', stockRoutes);

    app.use('/api/', keyRoutes);

    app.use('/api/', upgradeRoutes);

    app.use('/api/', replacementRoutes)

    app.use('/api/', sellixRoutes)

    app.use('/api/', paymentRoutes)

    app.use('/api', productRoutes)

    app.use('/admin/api', adminRoutes);

    app.use('/api', affilateRoutes)
    
}


// Export all routes
export default routes