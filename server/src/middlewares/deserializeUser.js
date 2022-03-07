import {signJwt, verifyJwt} from '../utils/jwt.js'
import {getMemorySession} from '../helpers/authHelper.js'

async function deserializeUser(req, res, next) {
    const {accessToken, refreshToken} = req.cookies

    if(!accessToken) {
        return next()
    }

    const {payload, expired} = verifyJwt(accessToken)


    // For a valid accessToken
    if (payload) {
        req.user = payload
        return next()
    }

    // For expired accessToken but a valid refreshToken
    const {payload: refresh} = expired && refreshToken ? verifyJwt(refreshToken) : {payload: null}
    
    if (!refresh) {
        return next();
    }

    const session = getMemorySession(refresh.sessionId)

    if (!session) {
        return next();
    }
    
    const newAccessToken = signJwt(session, process.env.JWT_ACCESS_TOKEN_EXPIRY)

    res.cookie("accessToken", newAccessToken, {
        maxAge: 30000, // 5mins
        httpOnly: true
    })

    req.user = verifyJwt(newAccessToken).payload

    return next()
}


export default deserializeUser