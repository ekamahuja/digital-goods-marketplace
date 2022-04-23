import {sendDiscordWebhook} from '../utils/discordWebhook.js'

export const sessions = []


export function getMemorySession(sessionId) {
    try {
        const session = sessions[sessionId]
    
        return session && session.valid ? session: null
    } catch(err) {
        sendDiscordWebhook('', '', 'error')
        return null
    }
}



export function createMemorySession(name, username, role) {
    const sessionId = String(Object.keys(sessions).length + 1)  

    const session = { sessionId, name, username, role, valid: true }

    sessions[sessionId] = session;
        
    return session;
}       



export function deleteMemorySession(sessionId) {
    const session = sessions[sessionId]
    if (session) {
        sessions[sessionId].valid = false
    }

    return sessions[sessionId]
}