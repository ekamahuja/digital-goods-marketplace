// Import packages and files
import 'dotenv/config'
import cluster from 'cluster'
import { cpus } from 'os'
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
const numberOfCores = cpus().length
console.log(numberOfCores)
const app = express()

// EJS setup
app.set('view engine', 'ejs')
app.use('/admin/assets', express.static('../client/assets'));
app.use('/moderator/assets', express.static('../client/assets'));
app.use('/assets', express.static('../client/assets'));
// app.use('/', express.static('../client'));

// Middlewaresblue
app.use(cookieParser())
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended: false}))
app.use(deserializeUser)
app.use(cors({
    credentials: true,
    origin: '*'
}))



async function startMultiCores() {
    if (cluster.isPrimary) {
        console.log(`Primary ${process.pid} is running`);
    
        for (let i = 0; i < numberOfCores; i++) {
            await cluster.fork()
        }
    
        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
            cluster.fork()
        });
    
    } else {
        startApp();
    }
}




// Application
async function startApp() {
    console.clear();
    console.log('=========================================================================================')
    await connectDB()
    const port = process.env.PORT || 8000
    const ip = process.env.IP || '127.0.0.1'
    app.listen(port, ip, () => {
        consola.success(`Worker ${process.pid} started`)
        consola.success(`The server is successfully listening on ${chalk.bold.green(ip)}:${chalk.bold.green(port)} (IP:PORT)`)
        consola.success(`Website: ${chalk.bold.green(process.env.CLIENT_URL)}`)
        console.log('=========================================================================================')
    })

    // Intialize server routes from routes folder
    routes(app)

    app.use(errorHandler)
}


// Start application
// startMultiCores()
startApp()

