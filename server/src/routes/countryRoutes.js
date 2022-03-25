import express from 'express'
const stockRoutes = express.Router();
import { addStock, getStock, createCountry, deleteCountry } from '../controllers/countryController.js'
import { adminOnly } from '../middlewares/adminOnly.js'


// create country
stockRoutes.post('/country', adminOnly, createCountry)

// delete country
stockRoutes.delete('/country', adminOnly, deleteCountry)

// add stock
stockRoutes.post('/stock', adminOnly, addStock)

//get stock
stockRoutes.get('/stock', getStock)




export default stockRoutes