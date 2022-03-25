import chalk from 'chalk'

export default async function errorHandler(err, req, res, next) {
    // consola.error(`Message: ${err.message}\n        Stack: ${err.stack}`)
    // console.log(`${chalk.bold.red('=========================================================================================')}`)
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode

    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.WEBSITE_MODE == "dev" ? err.stack : null
    })
}