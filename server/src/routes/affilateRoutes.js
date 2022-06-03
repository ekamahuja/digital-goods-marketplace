import express from 'express'
import { requireUser, adminApiOnly } from '../middlewares/apiRouteProtection.js'
import { affilateSetup, affilatePricing, createPayout, fetchPayouts, updatePayoutStatus } from '../controllers/affilateController.js'
const affilateRoutes = express.Router()


affilateRoutes.get('/affilate/setup', requireUser, affilateSetup)
affilateRoutes.get('/affilate/pricing', affilatePricing)
affilateRoutes.post('/affilate/payout/create', requireUser, createPayout)
affilateRoutes.get(`/affilate/payout`, requireUser, fetchPayouts)
affilateRoutes.get('/affilate/payout/update', adminApiOnly, updatePayoutStatus)

export default affilateRoutes