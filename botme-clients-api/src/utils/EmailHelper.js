"use strict";
const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'w11cafe113245@gmail.com', // generated ethereal user
        pass: 'w11cafe321', // generated ethereal password
    },
});


/**
 * Send the email to the user
 * @param from
 * @param to
 * @param subject
 * @param body
 * @returns {Promise<boolean>}
 */
async function sendEmail(from = '', to = '', subject = '', body = '') {
    try {
        let info = await transporter.sendMail({
            from: '"BotMe" <w11cafe113245@gmail.com>', // sender address
            to: to, // list of receivers
            subject: "Verify your email address!", // Subject line
            text: "Hello world?", // plain text body
            html:`<b>${body}</b>`, // html body
        });

        console.log("Message sent: %s", info.messageId);

        return !!info.messageId
    } catch (e) {
        console.log('Send Mail Exception => ', e)
        return e
    }
}

module.exports = ({sendEmail})

