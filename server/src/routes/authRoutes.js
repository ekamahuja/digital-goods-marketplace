import express from 'express'
const userAuth = express.Router();
import {createSession, getSession, deleteSession} from '../controllers/authController.js'


//login
userAuth.post('/session', createSession)

// fetch current session
userAuth.get('/session', getSession)

// logout
userAuth.delete('/session', deleteSession)



// exporting auth routes
export default userAuth