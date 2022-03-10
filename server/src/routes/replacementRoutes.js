import express from 'express'
import { createSpotifyAuthUrl, getReplacement } from '../controllers/replacementController.js'
const replacementRoutes = express.Router()


replacementRoutes.get('/spotify/createauth', createSpotifyAuthUrl)
replacementRoutes.post('/replacement', getReplacement)



export default replacementRoutes