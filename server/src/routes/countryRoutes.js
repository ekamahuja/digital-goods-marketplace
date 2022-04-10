import express from 'express'
const stockRoutes = express.Router();
import { addStock, getStock, createCountry, deleteCountry } from '../controllers/countryController.js'
import { adminApiOnly } from '../middlewares/apiRouteProtection.js'


// create country
stockRoutes.post('/country', adminApiOnly, createCountry)

// delete country
stockRoutes.delete('/country', adminApiOnly, deleteCountry)

// add stock
stockRoutes.post('/stock', adminApiOnly, addStock)

//get stock
stockRoutes.get('/stock', getStock)




export default stockRoutes