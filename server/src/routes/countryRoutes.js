import express from 'express'
const stockRoutes = express.Router();
import { addStock, getStock } from '../controllers/countryController.js'
import { requireUser } from '../middlewares/requireUser.js'


// add stock
stockRoutes.post('/stock', requireUser, addStock)

//get stock
stockRoutes.get('/stock', getStock)




export default stockRoutes