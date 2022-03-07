import express from 'express'
const stockRoutes = express.Router();
import { addStock } from '../controllers/countryController.js'
import { requireUser } from '../middlewares/requireUser.js'


// add stock
stockRoutes.post('/admin', requireUser, addStock)




export default stockRoutes