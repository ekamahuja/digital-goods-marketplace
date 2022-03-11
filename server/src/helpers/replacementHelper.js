import fetch from 'node-fetch'



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
                email: response.email,
                plan: (response.product) ? response.product : null,
                country: response.country,
            }
        
    } catch (err) {
        return { success: false, error: err.message}
    }
}