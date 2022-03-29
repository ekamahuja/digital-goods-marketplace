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

const app = express();

function routes(app) {

    app.get('/', async function(req, res, next) {
        res.render('../../client/comming_soon')
    })

    // app.use('/', viewRoutes);
    

    app.use('/api/auth', authRoutes);

    app.use('/api/data', stockRoutes);

    app.use('/api/', keyRoutes);

    app.use('/api/', upgradeRoutes);

    app.use('/api/', replacementRoutes)

    app.use('/api/', sellixRoutes)

    app.use('/admin/api', adminRoutes);
    
}


// Export all routes
export default routes