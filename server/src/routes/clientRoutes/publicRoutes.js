import  { Router } from 'express'
import { replacementCallBack, replacementPage } from '../../controllers/clientController.js'
import { Config } from '../../schemas/configSchema.js'

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



clientRoutes.get('/contact', async(req, res) => {
    const {contactLink} = await Config.findOne({})
    res.redirect(contactLink);
})

clientRoutes.get('/discord', async(req, res) => {
    const {discordServer} = await Config.findOne({})
    res.redirect(discordServer);
})



export default clientRoutes