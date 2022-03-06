export const sessions = []


export function getMemorySession(sessionId) {
    const session = sessions[sessionId]

    return session && session.valid ? session: null
}



export function createMemorySession(name, username) {
    const sessionId = String(Object.keys(sessions).length + 1)  

    const session = { sessionId, name, username, valid: true }

    sessions[sessionId] = session;
    console.log(sessions)

    return session;
}       



export function deleteMemorySession(sessionId) {
    const session = sessions[sessionId]
    if (session) {
        sessions[sessionId].valid = false
    }

    return sessions[sessionId]
}