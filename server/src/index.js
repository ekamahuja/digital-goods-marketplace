// Import packages and files
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import consola from 'consola'
import chalk from 'chalk'
import cookieParser from 'cookie-parser'
import connectDB from './utils/database/connect.js'


// Variables
const app = express()


// Middlewares
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
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
}



// Start application
startApp();