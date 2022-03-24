import {signJwt, verifyJwt} from '../utils/jwt.js'
import {getMemorySession} from '../helpers/authHelper.js'

// async function deserializeUser(req, res, next) {
//     const {accessToken, refreshToken} = req.cookies
//     console.log(accessToken, refreshToken)
//     if(!accessToken && !refreshToken) {
//         console.log("no tokens")
//         return next()
//     }


//     const {payload, expired} = verifyJwt(accessToken)
//     console.log(`expired: ${expired}`)
//     console.log(`payload: ${payload}`)

//     // For a valid accessToken
//     if (payload) {
//         console.log("we have a payload")
//         req.user = payload
//         return next()
//     }

//     // For expired accessToken but a valid refreshToken
//     const {payload: refresh} = expired && refreshToken ? verifyJwt(refreshToken) : {payload: null}
    
//     if (!refresh) {
//         console.log("no refresh")
//         return next();
//     }

//     const session = getMemorySession(refresh.sessionId)

//     if (!session) {
//         return next();
//     }
    
//     const newAccessToken = signJwt(session, process.env.JWT_ACCESS_TOKEN_EXPIRY)

//     res.cookie("accessToken", newAccessToken, {
//         maxAge: 30000, // 5mins
//         httpOnly: true
//     })

//     req.user = verifyJwt(newAccessToken).payload

//     return next()
// }



async function deserializeUser(req, res, next) {
    const {accessToken, refreshToken} = req.cookies

    // No refresh token or access token
    if (!accessToken && !refreshToken) {
        return next()
    }

    // Has refresh token but not access token
    if (refreshToken && !accessToken) {
        const {payload, expired} = verifyJwt(refreshToken)
        if (!payload) return next()

        const session = getMemorySession(payload.sessionId)
        if (!session || !session.valid) return next()

        const newAccessToken = signJwt(session, process.env.JWT_ACCESS_TOKEN_EXPIRY)
        res.cookie("accessToken", newAccessToken, {
            maxAge: 30000, // 5mins
            httpOnly: true
        })
        
        req.user = verifyJwt(newAccessToken).payload

        return next()
    }


    // Has access token but no refresh token
    if (accessToken && !refreshToken) {
        const {payload, expired} = verifyJwt(accessToken)
        if (!payload) return next()

        const session = getMemorySession(payload.sessionId)
        if (!session || !session.valid) return next()

        req.user = payload
        return next()
    }


    if (accessToken && refreshToken) {
        const {payload, expired} = verifyJwt(accessToken)
        if (payload) {
            req.user = payload
            return next()
        }

        const decodedRefreshToken = verifyJwt(refreshToken)
        if (decodedRefreshToken.payload) {
            const session = getMemorySession(payload.sessionId)
            if (!session || !session.valid) return next()

            const newAccessToken = signJwt(session, process.env.JWT_ACCESS_TOKEN_EXPIRY)

            res.cookie("accessToken", newAccessToken, {
                maxAge: 30000, // 5mins
                httpOnly: true
            })
            
            req.user = verifyJwt(newAccessToken).payload

            return next()
        }

        return next()

    }



    return next()

}


export default deserializeUser