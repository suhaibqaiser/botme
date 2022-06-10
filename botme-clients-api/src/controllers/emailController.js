const Response = require("../models/response");
const emailHelper = require("../utils/EmailHelper.js")
const {sendPlaceOrderEmail} = require("../utils/EmailTemplates");

/**
 * we have following parameters to pass emailSendType, body
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function sendEmail(req, res) {
    try{
        let response = new Response();

        const queryParams = req.query
        console.log('queryParams =>', queryParams)

        const body = req.body
        console.log('body =>', body)

        if((queryParams || !queryParams) && (!queryParams['emailSendingTypes'])) {
            response.status = "danger";
            response.message= "Sending Email Type is required."
            return res.send(response)
        }

        const generateEmailTemplate = sendPlaceOrderEmail(body)
        const sendEmail = await emailHelper.sendEmail(
            'w11cafe113245@gmail.com',
            body.clientEmail,
            'Thank you For Placing Order!',
            generateEmailTemplate
        )

        console.log('Email Sent =>', sendEmail)

        response.message = sendEmail
        response.status = "success"
        return res.send(response)

    } catch (e) {
        response.payload = e
        response.message = "failed to send email notification"
        response.status = "danger"
        return res.send(response)
    }

}

module.exports = ({sendEmail})
