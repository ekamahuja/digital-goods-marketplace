import puppeteer from 'puppeteer-extra' 
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'

  puppeteer.use(
    RecaptchaPlugin({
      provider: {
        id: '2captcha',
        token: process.env.CAPTCHA_TOKEN
      },
      visualFeedback: true
    })
  )


export const getCookie = async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // const recorder = new PuppeteerScreenRecorder(page);
        // await recorder.start('./simple.mp4');
        await page.goto('https://accounts.spotify.com/en/login/');
        await page.focus('#login-username')

        await page.keyboard.type(process.env.SPOTIFY_EMAIL)

        await page.focus('#login-password')
        await page.keyboard.type(process.env.SPOTIFY_EMAIL)

        // await page.solveRecaptchas()

        page.click('#login-button > div.ButtonInner-sc-14ud5tc-0.lbsIMA.encore-bright-accent-set')
        const cookieResponse = await page.waitForResponse(response => response.url() == "https://accounts.spotify.com/login/password")
        const cookies = await page._client.send('Network.getAllCookies');
        const authCookies = cookies.cookies.filter(cookie => cookie.name == 'sp_dc')
        // await recorder.stop();
        await browser.close();

        return `${authCookies[0].name}=${authCookies[0].value}`
        
    } catch (err) {
        console.error(err)
        return null
    }
}


export const cookie = async () => {
    for (let i = 0; i < 3; i++) {
        const cookie = await getCookie()
        if (cookie) {
            return cookie
        }
    }
    return null
}



