// Import packages and files
import mongoose from 'mongoose'
import chalk from 'chalk'


// Function to connect to database using mongoose
async function connectDB() {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        consola.success(`Successfully connected to MongoDB: ${chalk.bold.green(connect.connection.host)}`)
    } catch (err) {
        consola.error(`Database connection error: ${chalk.bold.red(err.message)}`)
        process.exit()
    }
}



// Exporting connectDB function
export default connectDB