import jwt from 'jsonwebtoken'

export const signJwt = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    return token;
}



export const verifyJwt = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        return decoded
    } catch (err) {
        return false;
    }
}