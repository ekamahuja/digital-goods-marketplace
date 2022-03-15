
import fetch from 'node-fetch'
import { generateAuthUrl } from '../helpers/replacementHelper.js'


export async function replacementPage(req, res, next) {
    const {spotifyToken} = req.cookies

    try {
        if (!spotifyToken) {
            const url = await generateAuthUrl()
            if (!url.authUrl) throw new Error("Could not generate auth url")

            res.redirect(url.authUrl)
        } else {
            res.render('../../client/replacement')
        }

    } catch (err) {
       next(err)
    }
}




export async function replacementCallBack(req, res, next) {
    try {
        const {SERVER_URL, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET} = process.env
        const { code, error } = req.query
        if (error) return res.redirect('/replacement')
        if (!code) throw new Error("Oauth code not provided")

        const params = {
            client_id: SPOTIFY_CLIENT_ID,
            client_secret: SPOTIFY_CLIENT_SECRET,
            code: code,
            grant_type: "authorization_code",
            redirect_uri: `${SERVER_URL}/api/spotify/oauth`
        }

        const options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: "POST",
            body: new URLSearchParams(params)
        }

        const request = await fetch("https://accounts.spotify.com/api/token", options)
        const response = await request.json()
        
        const {access_token, expires_in} = response
        if (response.error) throw new Error(response.error)

        return res.cookie('spotifyToken', access_token, {
            maxAge: expires_in * 1000,
            httpOnly: true
        }).redirect('/replacement')

    } catch (err) {
        next(err)
    }
}