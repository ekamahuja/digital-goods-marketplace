import express from 'express'
const userAuth = express.Router();
import { requireUser } from '../middlewares/apiRouteProtection.js'
import {createSession, getSession, deleteSession} from '../controllers/authController.js'


//login
userAuth.post('/session', createSession)

// fetch current session
userAuth.get('/session', requireUser, getSession)

// logout
userAuth.delete('/session', requireUser, deleteSession)



// exporting auth routes
export default userAuth