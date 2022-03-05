// Import packages and files
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import consola from 'consola'
import connectDB from './utils/database/connect.js'


// Variables
const app = express()


// Middlewares
app.use(cors({
    origin: '*'
}))

app.use(express.json())


// Application
async function startApp() {
    console.clear();
    connectDB()
    const port = process.env.PORT || 8080
    app.listen(port, () => {
        consola.success(`The server is successfully listening on port ${port}`)
    })
}



// Start application
startApp();             