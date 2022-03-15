import express from 'express'
import { getReplacement } from '../controllers/replacementController.js'
const replacementRoutes = express.Router()


replacementRoutes.post('/replacement', getReplacement)


export default replacementRoutes