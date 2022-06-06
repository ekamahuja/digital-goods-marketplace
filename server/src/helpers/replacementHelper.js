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



/**
 * It takes a bearer token, sends it to the Spotify API, and returns the user's Spotify ID, email,
 * plan, and country.
 * @param bearerToken - The access token that was returned from the authorization code grant.
 * @returns An object with the user's id, email, plan, and country.
 */
export const spotifyUser = async (bearerToken) => {
    try {
        /* It's setting the options for the fetch request. */
        const options = {
            headers: { Authorization: `Bearer ${bearerToken}`},
            referrerPolicy: "strict-origin-when-cross-origin",
            method: "GET",
            body: null
        }

        /* It's making a request to the Spotify API to get the user's information. */
        const request = await fetch(`https://api.spotify.com/v1/me`, options)
        if (request.status == 403) throw new Error("User not registered in the Developer Dashboard")
        const response = await request.json();
       
        /* It's checking if the response has an error property. If it does, it throws an error. */
        if (response.error) throw new Error(response.error.message)

        /* It's returning an object with the user's id, email, plan, and country. */
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