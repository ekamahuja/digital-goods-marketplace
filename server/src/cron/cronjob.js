import autoRestock from './autoRestock.js'
import updateAuthCookie from './updateCookie.js'



// Fetches new auth cookies every 24hours and stores it in db
updateAuthCookie.start()
autoRestock.start()