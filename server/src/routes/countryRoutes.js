import express from 'express'
const stockRoutes = express.Router();
import { addStock, getStock, createCountry } from '../controllers/countryController.js'
import { requireUser } from '../middlewares/requireUser.js'


// create country
stockRoutes.post('/country', requireUser, createCountry)

// add stock
stockRoutes.post('/stock', requireUser, addStock)

//get stock
stockRoutes.get('/stock', getStock)




export default stockRoutes