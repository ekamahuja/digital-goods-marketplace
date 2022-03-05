import 'dotenv/config'
import express from 'express'
import consola from 'consola'
import connectDB from './utils/database/connect.js'

const app = express()


async function startApp() {
    console.clear();
    connectDB()
    const port = process.env.PORT || 8080
    app.listen(port, () => {
        consola.success(`The server is successfully listening on port ${port}`)
    })
}



startApp();             