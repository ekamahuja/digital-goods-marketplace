import { getMemorySession } from '../helpers/authHelper.js'
import { verifyJwt } from '../utils/jwt.js'



const deserializeUser = (req, res, next) => {
    try {
         const { accessToken } = req.cookies
        if (!accessToken) return next();

        const sessionId = verifyJwt(accessToken)
        if (!sessionId) return next();

        const session = getMemorySession(sessionId)
        if (!session) return next();

        req.user = session

        return next();
    } catch(err) {
        return next()
    }

}


export default deserializeUser