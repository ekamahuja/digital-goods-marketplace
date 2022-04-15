import express from 'express'
const productRoutes = express.Router()
import {getProductData} from '../controllers/productController.js'

productRoutes.get('/products/:pid', getProductData)



export default productRoutes