import fetch from 'node-fetch'
import SpotifyWebApi from 'spotify-web-api-node'

export const generateAuthUrl = () => {
    const scopes = ['user-read-email', 'user-read-private']
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const state = 'replacement'
    const showDialog = true
    const responseType = 'code'

    const spotifyApi = new SpotifyWebApi({
        clientId: clientId,
        redirectUri: `${process.env.SERVER_URL}/api/spotify/oauth`
    })  

    const authUrl = spotifyApi.createAuthorizeURL(
        scopes,
        state,
        showDialog,
        responseType
    )

    return {
        authUrl: authUrl || null
    }
}



export const spotifyUser = async (bearerToken) => {
    try {
        const options = {
            headers: { Authorization: `Bearer ${bearerToken}`},
            referrerPolicy: "strict-origin-when-cross-origin",
            method: "GET",
            body: null
        }

        const request = await fetch(`https://api.spotify.com/v1/me`, options)
        if (request.status == 403) throw new Error("User not registered in the Developer Dashboard")
        const response = await request.json();
       
        if (response.error) throw new Error(response.error.message)

        return {
                id: response.id,
                email: (response.email).toLowerCase(),
                plan: (response.product) ? response.product : null,
                country: response.country,
            }
        
    } catch (err) {
        return { success: false, error: err.message, stack: err}
    }
}