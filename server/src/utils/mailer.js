import path from  'path'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'


const handleBarOptions = {
    viewEngine: {
        extName: ".html",
        partialDir: path.resolve("./src/utils/views"),
        defaultLayout: false
    },
    viewPath: path.resolve('./src/utils/views'),
    extName: ".handlebars"
}


const sendMail = async (context, template) => {
    try {
        const {SMTP_USER, SMTP_FROM, SMTP_PASSWORD, SMTP_HOST} = process.env

        const mailer = nodemailer.createTransport({
            host: `${SMTP_HOST}`,
            port: 465,
            secure: true,
            auth: {
                user: `${SMTP_USER}`,
                pass: `${SMTP_PASSWORD}`
            },
          });

          mailer.use('compile', hbs(handleBarOptions))
 

          const sentEmail = await mailer.sendMail({
              from: `${SMTP_FROM}`,
              to: `${context.customerEmail}`,
              subject: `${context.subject}`,
              template,
              context
          })

          return {sucess: true}
    } catch(err) {
        console.log(err)
        return {sucess: false, message: err.message}
    }

}


export default sendMail



// sendMail("catabi6914@falkyz.com", "bruh with logo-text fontagain-udpated test 12", "this is the body!")



// {
//     thankyouMessage: "Thank you, Its Qwerty!",
//     amountPaid: "6.50",
//     planName: "x1 Personal Plan",
//     clientUrl: "https://upgrader.pw",
//     orderId: "123",
//     time: "June 06, 2022, 7:30:11 AM"
// }