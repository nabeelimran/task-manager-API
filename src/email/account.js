const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from : 'nabeel.imran852@gmail.com',
        subject: 'Welcome to the application!',
        text: `Hi ${name}, thanks for joining our application. Let us know about your experience with the application.` 
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from : 'nabeel.imran852@gmail.com',
        subject: 'We will miss you',
        text: `Hi ${name}, hope you will come back soon. Please share your feedback so we can improve our app.\n Thanks.\n\n Nabeel Imran` 
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}