import mongoose from 'mongoose'
import chalk from 'chalk'


async function connectDB() {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        consola.success(`Successfully connected to MongoDB: ${chalk.green.bold(connect.connection.host)}`)
    } catch (err) {
        consola.error(`Database connection error: ${chalk.bold.red(err.message)}`)
        process.exit()
    }
}



export default connectDB