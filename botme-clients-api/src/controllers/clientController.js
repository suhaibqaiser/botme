const clientService = require("../services/clientService")
const Response = require("../models/response")
const {v4: uuidv4} = require('uuid');
const crypto = require('crypto');
const sessionController = require("./sessionController");
const {clientStateObj, stakeholdersList, stakeholdersObj} = require("../utils/helper");
const emailHelper = require("../utils/EmailHelper.js")
const {addDevice} = require("../utils/helperMethods");

// Display list of all Clients.
async function getClientList(req, res) {
    try {
        let response = new Response()
        let clients = await clientService.getClientList()

        if (clients) {
            response.payload = clients
            response.status = "success"
            return res.json(response);
        }

        response.message = "No clients found";
        response.status = "danger";
        return res.json(response);

    } catch (e) {
        response.status = "danger";
        response.message = e
        return res.json(response);
    }
}

// Display details for a specific Client.
async function getClientDetail(req, res) {
    try {
        let response = new Response()

        if (!req.query.clientID) {
            response.status = "danger";
            response.message = "Client id is required."
            return res.json(response);
        }

        const client = await clientService.getClientById(req.query.clientID)

        if (client) {
            response.payload = client;
            response.status = "success";
            return res.json(response);
        }

        response.message = "No clients are added yet.";
        response.status = "danger";
        return res.json(response);

    } catch (e) {
        response.status = "danger";
        response.message = e
        return res.json(response);
    }
}

// Create new client
async function addClient(req, res) {
    try {
        let response = new Response()


        if (!stakeholdersList.includes(client.clientType)) {
            response.status = "danger";
            response.message = "Client type is invalid."
            return res.json(response);
        }

        if (!client.clientType || !client.clientSecret || !client.restaurantId || !client.secretHint) {
            response.message = "Clients validation failed."
            response.status = "danger"
            return res.send(response);
        }

        let stakeholder = {}
        let client = JSON.parse(JSON.stringify(req.body.client))

        // getting the stakeholder object
        if (stakeholdersObj[client.clientType] === stakeholdersObj.device) stakeholder = await addDevice(stakeholder)
        if (stakeholdersObj[client.clientType] === stakeholdersObj.customer) stakeholder = req.body.customer

        if(!stakeholder) {
            response.message = "Failed to add stakeholder."
            response.status = "danger"
            return res.send(response);
        }

        if(!stakeholder || !stakeholder.label) {
            response.message = "Stakeholder label required."
            response.status = "danger"
            return res.send(response);
        }

        client.label = uuidv4()
        client.clientID = stakeholder.label

        let newClient = await clientService.addClient(client)
        if (!newClient) {
            response.message = "Failed to add client."
            response.status = "danger"
            return res.send(response);
        }


        const redirect_url = `https://stg.gofindmenu.com/home?verification_token=${stakeholder.verificationToken}&clientID=${stakeholder.clientID}`

        const sendEmail = await emailHelper.sendEmail(
            'w11cafe113245@gmail.com',
            stakeholder.clientEmail,
            'Verify your email address!',
            `
            <!Doctype Html>  
            <Html>     
            <Head>      
        </Head> 
        <body>   
            <div style="background: #222222;font-family: Roboto, sans-serif; list-style: none; color: white; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; max-width: 600px; width: 600px; margin: 0px auto; padding: 60px 0px;">
    <div style="font-family: Roboto, sans-serif; margin: 0px 0px 26px; list-style: none; color: white; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; text-align: center;background: #222222">
        <a target="_blank" href="https://stg.gofindmenu.com/home" style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; display: block;">
            <img src="https://stg.gofindmenu.com/assets/images/logo/web-logo.png" alt="" style="width: 100px;">
        </a>
    </div>
    <div style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; text-align: center; box-shadow: rgba(184, 189, 209, 0.2) 0px 0px 20px 0px; border-top: 4px solid #E7272D; background: #222222;">
        <div style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; padding: 60px 35px 0px;background: #222222">
            <div style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; padding: 0px 0px 60px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; border-bottom: 1px solid rgb(207, 210, 220);background: #222222">
                <h3 style="font-family: Roboto, sans-serif; margin: 0px 0px 35px; list-style: none; color: white; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; font-size: 22px; font-weight: normal;">Verify your email address!</h3>
                <p style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; line-height: 1.59; font-size: 18px; text-align: left; font-weight: normal;">
                    Hi ${stakeholder.name},
                    <br>
                    <br>
                    We are happy to have you on board! Please copy the below link to verify your email address:
                    <br>
                    <br>
                   <small style="color: #E7272D">${redirect_url}</small>
                </p>
           
                <p style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; line-height: 1.59; font-size: 18px; text-align: left; font-weight: normal;">
                    <br>
                    If you did not sign up, you can safely ignore this email.
                </p>
                <p style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; line-height: 1.59; font-size: 18px; text-align: left; font-weight: normal;"><br>
                    Thanks,<br>
                </p>
            </div>
        </div>
        <div style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; padding: 35px;">
            <table style="width: 100%;">
                <tbody>
                <tr>
                    <td style="width: 50%;">
                        <p style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; color: white; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; text-align: left; line-height: 1.59; font-size: 18px; font-weight: normal;">The <a href="https://stg.gofindmenu.com/home" target="_blank" style="font-family: Roboto, sans-serif; margin: 0px; list-style: none; padding: 0px; outline: none; word-break: break-word; overflow-wrap: break-word; box-sizing: border-box; text-decoration: none; color: #E7272D;">Botme</a>
                            Team</p>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</body>
       
            `
        )

        console.log('Email Sent =>', sendEmail)

        if (newClient && sendEmail.status) {
            response.payload = newClient
            response.message = "Your account has been created successfully! Verification link is sent on your email."
            response.status = "success"
            return res.send(response)
        }

        response.message = "Error in saving client"
        response.payload = {
            newClient: newClient,
            sendEmail: sendEmail
        }
        response.status = "danger"
        return res.send(response)

    } catch (e) {
        response.message = 'Exception: Failed to add client.'
        response.payload = e
        response.status = "danger"
        return res.send(response)
    }
}

// Authenticate client and provide token at successful authentication
async function authorizeClient(req, res) {
    let response = new Response()

    if (!req.body.clientID || !req.body.clientSecret) {
        response.message = 'clientID, clientDeviceId and clientSecret is required';
        response.status = "danger"
        return res.send(response);
    }

    let client = await clientService.getClientDetail(req.body.clientID, req.body.clientSecret)

    client = JSON.parse(JSON.stringify(client))

    console.log('client =>', client)

    if (client && client.hasOwnProperty('clientEmailVerified') && !client.clientEmailVerified) {
        response.message = `We have sent you a verification email to your email address. ${client.clientEmail} Click and follow the link inside it.`
        response.status = "danger"
        return res.send(response)
    }


    if (client) {

        let hash = crypto.createHash('sha256');
        let clientToken = hash.update(Date()).digest('hex');

        let session = {
            clientID: req.body.clientID,
            clientToken: clientToken
        }

        let newSession = await sessionController.createSession(session)
        if (newSession) {
            response.payload = {
                ...client,
                "clientToken": newSession.clientToken,
                'isLoggedIn': true,
                'sessionId': newSession.sessionId
            }
            response.status = "success"
            return res.send(response)
        } else {
            response.message = "Error in creating session"
            response.status = "danger"
            return res.send(response)
        }
    } else {
        response.message = "clientID or clientSecret is incorrect or client is not active"
        response.status = "danger"
        return res.send(response)
    }
}

// Update client
async function updateClient(req, res) {
    let response = new Response()


    if (!req.body.clientID) {
        response.payload = {message: 'clientID is required'};
        return res.status(400).send(response);
    }


    let client = {
        clientDeviceId: req.body.clientDeviceId,
        clientSecret: req.body.clientSecret,
        clientName: req.body.clientName,
        clientDebug: req.body.clientDebug,
        clientVoiceEnabled: req.body.clientVoiceEnabled,
        clientVoiceTimeout: req.body.clientVoiceTimeout,
        clientUpdated: Date(),
        clientActive: req.body.clientActive,
        clientComment: req.body.clientComment,
        restaurantId: req.body.restaurantId,
        clientEmail: req.body.clientEmail,
        clientSecretHint: req.body.clientSecretHint,
        clientEmailVerified: req.body.clientEmailVerified,
        clientState: req.body.clientState,
        clientDescription: req.body.clientDescription,
        verification_token: req.body.verification_token,
        clientType: req.body.clientType
    }

    let updatedClient = await clientService.updateClient(req.body.clientID, client)
    if (updatedClient) {
        response.payload = updatedClient
        response.message = "User updated successfully!"
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.message = "Error in updating client, make sure the clientId is correct."
        response.status = "error"
        return res.status(400).send(response)
    }
}

async function deleteClient(req, res) {
    let response = new Response()

    if (!req.query.clientID) {
        response.payload = {message: 'clientID is required'};
        return res.status(400).send(response);
    }

    if (await clientService.deleteClient(req.query.clientID)) {
        response.payload = {"message": "Client deleted successfully"}
        response.status = "success"
        return res.status(200).send(response)
    } else {
        response.payload = "Error in deleting client, make sure the clientId is correct."
        response.status = "error"
        return res.status(400).send(response)
    }
}

async function verifyCustomerAccount(req, res) {

    let response = new Response()

    const filter = req.query

    console.log('filter =>', filter)

    if (!filter.verification_token || !filter.clientID) {
        response.message = `Sorry this request is invalid to verify your account!`
        response.status = "danger"
        return res.send(response)
    }

    const verify = await clientService.verifyAccount(filter)
    console.log(JSON.parse(JSON.stringify(verify)))
    if (verify.nModified) {
        response.message = `Your account is successfully verified!`
        response.status = "success"
        return res.send(response)
    }

    response.message = `Sorry failed to verify your account!`
    response.status = "danger"
    return res.send(response)

}

// Client heartbeat to keep alive
async function heartbeatClient(req, res) {
    let response = new Response()

    if (!req.body.clientToken) {
        response.payload = {message: 'clientToken is required'};
        return res.status(400).send(response);
    }
    let session = await sessionController.getSessionByToken(req.body.clientToken)

    if (session) {
        session.sessionUpdated = Date()
        session.sessionActive = true;
        if (await sessionController.updateSession(session.clientToken, session)) {

            response.payload = {"message": "Client updated successfully"}
            response.status = "success"
            return res.status(200).send(response)
        } else {
            response.payload = "Error in updating client, make sure the clientToken is correct."
            response.status = "error"
            return res.status(400).send(response)
        }
    } else {
        response.payload = "clientSecret is incorrect or session is invalid"
        response.status = "error"
        return res.status(400).send(response)
    }
}

// exports.client_command = async function (req, res) {
//     if (!req.body.clientID) {
//         failure.payload = {message: 'clientID not found'};
//         return res.status(404).send(failure);
//     }
//
//     let queueResponse = await queue.queueMessage(req.body.clientID, req.body.command);
//
//     if (queueResponse.status == 200) {
//         success.payload = 'Message queued successfully: ' + queueResponse.message;
//         res.status(200).send(success);
//     } else {
//         failure.payload = queueResponse.message;
//         res.status(403).send(failure);
//     }
// }

module.exports = ({
    getClientList,
    getClientDetail,
    addClient,
    authorizeClient,
    updateClient,
    deleteClient,
    heartbeatClient,
    verifyCustomerAccount
})
