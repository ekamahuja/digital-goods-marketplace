// Import packages and files
import express from 'express';
import authRoutes from './authRoutes.js'
import stockRoutes from './countryRoutes.js'
import keyRoutes from './keyRoutes.js'
import upgradeRoutes from './upgradeRoutes.js'
import replacementRoutes from './replacementRoutes.js'

const app = express();

function routes(app) {
    // app.get('/', function(req, res) {
    //     res.json({
    //         sucess: true,
    //         message: "Sucessfully running",
    //         requestIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    //     })
    // })
  
    app.use('/api/auth', authRoutes);

    app.use('/api/data', stockRoutes);

    app.use('/api/', keyRoutes);

    app.use('/api/', upgradeRoutes);

    app.use('/api/', replacementRoutes)
}


// Export all routes
export default routes