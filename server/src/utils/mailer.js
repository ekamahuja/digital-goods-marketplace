import nodemailer from 'nodemailer'



const sendMail = async (email, subject, body) => {
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

          const sentEmail = await mailer.sendMail({
              from: `${SMTP_FROM}`,
              to: `${email}`,
              subject: `${subject}`,
              text: `${body}`,
              html: `${body}`,
          })

          console.log("Message sent: %s", sentEmail.messageId);
          return {sucess: true}
    } catch(err) {
        return {sucess: false, message: err.message}
    }

}


export default sendMail