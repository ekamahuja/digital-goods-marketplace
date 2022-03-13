// Import packages and files
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import consola from 'consola'
import chalk from 'chalk'
import cookieParser from 'cookie-parser'
import connectDB from './utils/connectDb.js'
import routes from './routes/all.js'
import deserializeUser from './middlewares/deserializeUser.js'
import errorHandler from './middlewares/errorHandler.js'
import './cron/cronjob.js'


// Variables
const app = express()


// Middlewares
app.use(cookieParser())
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended: false}))
app.use(deserializeUser)


app.use(cors({
    credentials: true,
    origin: '*'
}))




// Application
async function startApp() {
    console.clear();
    console.log('=========================================================================================')
    await connectDB()
    const port = process.env.PORT || 8000
    app.listen(port, () => {
        consola.success(`The server is successfully listening on port ${chalk.bold.blue(port)}`)
        console.log('=========================================================================================')
    })


    // Intialize server routes from routes folder
    
    routes(app)
    app.use('/', express.static('../client'))
    app.use('/upgrade', express.static('../client/upgrade.html'))
    app.use(errorHandler)
}


// Start application
startApp();

