import { verifyJwt } from '../utils/jwt.js'



const deserializeUser = (req, res, next) => {
    try {
         const { accessToken } = req.cookies
        if (!accessToken) return next();

        const session = verifyJwt(accessToken)
        if (!session) return next();

        req.user = session

        return next();
    } catch(err) {
        return next()
    }

}


export default deserializeUser