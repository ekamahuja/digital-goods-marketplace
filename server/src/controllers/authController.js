import { User } from '../schemas/userSchema.js'
import { generateSession, deleteMemorySession} from '../helpers/authHelper.js'
import validator from 'validator'
import { verifyJwt } from '../utils/jwt.js'


/**
 * It takes in a request body, validates the data, creates a new user, generates a session, and returns
 * a response with a cookie and a redirect url.
 * @param req - the request object
 * @param res - the response object
 * @param next - next middleware function
 * @returns The user object is being returned.
 */
    export const registerAccount = async (req, res, next) => {
        try {
            const {firstName, lastName, userName, email, password} = req.body
            if (!(firstName, lastName, userName, email, password)) throw new Error("Please enter all fields")
            if (!validator.isEmail(email)) throw new Error("Invalid email address")
            if (password.length < 2) throw new Error("Please enter a stronger password")    

            let user = await User.findOne({ $or: [{userName: userName.toLowerCase()}, {email: email.toLowerCase()}] })
            if (user) throw new Error("An account with that email already exists. Please login.")   

            user = await User.create({firstName, lastName, userName, email, password}) 

            const { token } = generateSession(user)

            const redirect = `${process.env.CLIENT_URL}/${user.role}/dashboard`

            res.cookie('accessToken', token, { maxAge: 4.32e+8, httpOnly: true })    

            return res.status(201).json({ success: true, message: "Successfully registered! Redirecting...", redirect })

        } catch(err) {
            next(err)
        }
    }





/**
 * It takes in a username or email and password, checks if the user exists, and if the password
 * matches, it generates a session and returns a token and redirect url
 * @param req - the request object
 * @param res - the response object
 * @param next - is a function that is called when the middleware is done.
 * @returns The user's sessionId and token are being returned.
 */
export const logInAccount = async (req, res, next) => {
    try {
        let {account, password} = req.body
        if (!(account, password)) throw new Error("Enter all fields")
        account = account.toLowerCase()

        const user = await User.findOne({ $or: [ {userName: account}, {email: account} ] })

        if (user && await user.matchPassword(password)) {
            const { token } = generateSession(user)
            const redirect = `${process.env.CLIENT_URL}/${user.role}/dashboard`

            res.cookie('accessToken', token, { maxAge: 4.32e+8, httpOnly: true })

            return res.status(201).json({ success: true, message: "Successfully authenticated! Redirecting...", redirect })
        }

        return res.status(403).json({ success: false, message: "Incorrect email or password"})

    } catch(err) {
        next(err)
    }
}





/**
 * It fetches the user's account data from the request (req.user) which is defined via middleware and returns it to the client.
 * @param req - The request object
 * @param res - The response object.
 * @param next - This is a function that you call when you want to pass control to the next middleware
 * function in the stack.
 * @returns The session object is being returned.
 */
export const fetchAccountData = (req, res, next) => {
    try {
        const session = req.user
        return res.status(200).json({ success: true, message: "Successfully fetched account data", session })
    } catch(err) {
        next(err)
    }
}





/**
 * It deletes the session from the database and then deletes the cookie from the client.
 * @param req - The request object
 * @param res - the response object
 * @param next - The next middleware function in the stack.
 * @returns The session object is being returned.
 */
export async function logOutAccount(req, res, next) {
    try {
        res.cookie("accessToken", null, { maxAge: 0, httpOnly: true })
    
        return res.json({success: true, message: "Sucessfully logged out"})
    } catch(err) {
        next(err)
    }
}


