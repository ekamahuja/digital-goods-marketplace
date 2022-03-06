import {User} from '../schemas/userSchema.js'
import {signJwt, verifyJwt} from '../utils/jwt.js'
import {createMemorySession, deleteMemorySession} from '../helpers/authHelper.js'

export async function createSession(req, res) {
    const {username, password} = req.body

    const user = await User.findOne({username})

    if (user && await user.matchPassword(password)) {
        const session = createMemorySession(user.name, username)

        const accessToken = signJwt({ name: user.name, username: user.username }, process.env.JWT_ACCESS_TOKEN_EXPIRY)
        const refreshToken = signJwt({ sessionId: session.sessionId }, process.env.JWT_REFRESH_TOKEN_EXPIRY)
    
    
        res.cookie('accessToken', accessToken, {
            maxAge: 30000, // 5 mins
            httpOnly: true
        })

        res.cookie('refreshToken', refreshToken, {
            maxAge: 2.592e+8, // 3 days
            httpOnly: true
        })
    
        return res.send(session)
    } else {
        return res.status(401).json({
            success: false,
            error: "Invalid email or password"
        })
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
    console.log(session)
    res.send({sucess: true, message: "Sucessfully logged out", session})
}


