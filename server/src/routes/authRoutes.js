import express from 'express'
const userAuth = express.Router();
import { requireUser } from '../middlewares/apiRouteProtection.js'
import { registerAccount, logInAccount, fetchAccountData, logOutAccount } from '../controllers/authController.js'


// register
userAuth.post('/register', registerAccount)

//login
userAuth.post('/login', logInAccount)

// fetch current session
userAuth.get('/session', requireUser, fetchAccountData)

// logout
userAuth.delete('/session', requireUser, logOutAccount)



// exporting auth routes
export default userAuth