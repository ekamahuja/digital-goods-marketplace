import jwt from 'jsonwebtoken'

export const signJwt = (payload, tokenExpiry) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: tokenExpiry})
    return token;
}



export const verifyJwt = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        return {
            payload: decoded,
            expired: false
        }
    } catch (err) {
        return {
            payload: null,
            expired: err.message.includes('jwt expired')
        }
    }
}