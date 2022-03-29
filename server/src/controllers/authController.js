import {User} from '../schemas/userSchema.js'
import {signJwt, verifyJwt} from '../utils/jwt.js'
import {createMemorySession, deleteMemorySession} from '../helpers/authHelper.js'

export async function createSession(req, res, next) {
    try {
        let {username, password} = req.body
        username = username.toLowerCase()

        const user = await User.findOne({username})

        if (user && await user.matchPassword(password)) {
            const session = createMemorySession(user.name, username, user.role)
            const accessToken = signJwt({ name: user.name, username: user.username, role: user.role }, process.env.JWT_ACCESS_TOKEN_EXPIRY)
            const refreshToken = signJwt({ sessionId: session.sessionId }, process.env.JWT_REFRESH_TOKEN_EXPIRY)

        
            res.cookie('accessToken', accessToken, {
                maxAge: 300000, // 5 mins
                httpOnly: true
            })

            res.cookie('refreshToken', refreshToken, {
                maxAge: 4.32e+8, // 5 days
                httpOnly: true              
            })
        
            return res.json({
                success: true,
                message: "Successfully authenticated",
                payload: verifyJwt(accessToken).payload
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }
    } catch (err) {
        next(err)
    }

}



export function getSession(req, res) {
    return res.send(req.user)
}



 export async function deleteSession(req, res) {
    res.cookie("accessToken", null, {
        maxAge: 0,
        httpOnly: true
    })

    res.cookie("refreshToken", null, {
        maxAge: 0,
        httpOnly: true
    })

    const session = await deleteMemorySession(req.user.sessionId)

    res.send({success: true, message: "Sucessfully logged out", session})
}



