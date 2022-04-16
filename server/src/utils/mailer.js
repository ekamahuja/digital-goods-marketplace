import nodemailer from 'nodemailer'



const sendMail = async (email, subject, body) => {
    try {
        const {SMTP_USER, SMTP_FROM, SMTP_PASSWORD, SMTP_HOST} = process.env

        const mailer = nodemailer.createTransport({
            host: `${SMTP_HOST}`,
            port: 587,
            secure: false,
            auth: {
                user: `${SMTP_USER}`,
                pass: `${SMTP_PASSWORD}`
            },
          });

          const sentEmail = await mailer.sendMail({
              from: `${SMTP_FROM}`,
              to: `${email}`,
              subject: `${subject}`,
              text: `${body}`,
              html: `${body}`
          })

          return {sucess: true}
    } catch(err) {
        return {sucess: false, message: err.message}
    }

}


export default sendMail