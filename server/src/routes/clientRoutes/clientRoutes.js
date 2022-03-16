import  { Router } from 'express'
import { replacementCallBack, replacementPage } from '../../controllers/clientController.js'

const clientRoutes = Router()


clientRoutes.get('/', async (req, res) => {
    res.render('../../client/index')
})

clientRoutes.get('/upgrade', async (req, res) => {
    res.render('../../client/upgrade')
})

clientRoutes.get('/keyinfo', async (req, res) => {
    res.render('../../client/keyinfo')
})

clientRoutes.get('/replacement', replacementPage)

clientRoutes.get('/api/spotify/oauth', replacementCallBack)



export default clientRoutes