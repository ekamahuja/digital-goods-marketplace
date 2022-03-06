import express from 'express'
const userAuth = express.Router();
import {createSession, getSession, deleteSession} from '../controllers/authController.js'
import { requireUser } from '../middlewares/requireUser.js'

//login
userAuth.post('/session', createSession)

// fetch current session
userAuth.get('/session', requireUser, getSession)

// logout
userAuth.delete('/session', requireUser, deleteSession)


export default userAuth