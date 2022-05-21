import { signJwt } from '../utils/jwt.js'
const sessions = []



/**
 * It takes a user object, creates a session object, adds the session object to the sessions array, and
 * returns the sessionId and a token.
 * @param user - {
 * @returns An object with two properties: sessionId and token.
 */
export const generateSession = (user) => {
    const sessionId = sessions.length + 1

    const session = {
        sessionId,
        userId: user.id,
        firstName: user.firstName,
        lastname: user.lastName,
        userName: user.userName,
        email: user.email,
        role: user.role,
        valid: true
    }

    sessions.push(session)
    const token = signJwt(sessionId)
    return { sessionId, token };
}


/**
 * It returns the session object if it exists and is valid, otherwise it returns null
 * @param sessionId - The session ID of the session you want to get.
 * @returns The session object.
 */
export function getMemorySession(sessionId) {
    try {
        let session = sessions[sessionId - 1]
        
        session = session.valid ? session : null
        return session
    } catch(err) {
        return null
    }
}



/**
 * It takes a sessionId as an argument, and if the sessionId exists in the sessions object, it sets the
 * valid property of the session to false.
 * @param sessionId - The session ID of the session to delete.
 * @returns The session object.
 */
export function deleteMemorySession(sessionId) {
    const session = sessions[sessionId]
    if (session) {
        sessions[sessionId].valid = false
    }

    return sessions[sessionId]
}