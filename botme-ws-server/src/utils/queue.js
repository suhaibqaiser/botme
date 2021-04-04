const {
    SQSClient,
    ReceiveMessageCommand,
    DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
const REGION = "us-east-1";
const QUEUEURL = "https://sqs.us-east-1.amazonaws.com/378223624719/BotMe_Commands";

var receiveMessage = async function () {
    const params = {
        MaxNumberOfMessages: 1,
        MessageAttributeNames: ["All"],
        QueueUrl: QUEUEURL,
        VisibilityTimeout: 20,
        WaitTimeSeconds: 20,
    };

    const sqs = new SQSClient({ region: REGION, credentials: fromIni({ profile: 'default' }) });
    var returnMessage = {};
    try {
        // Recevie Message
        const data = await sqs.send(new ReceiveMessageCommand(params));
        // Sanity check
        if (data.Messages !== undefined) {
            // Process incomming message 
            returnMessage.command = data.Messages[0].Body;
            returnMessage.clientID = data.Messages[0].MessageAttributes.clientID.StringValue;
            returnMessage.ReceiptHandle = data.Messages[0].ReceiptHandle;
        } else {
            console.log("No messages found");
        }
    } catch (err) {
        console.log("Receive Error", err);
    }
    return returnMessage;
}

var deleteMessage = async function (rHandle) {
    //Delete message
    const sqs = new SQSClient({ region: REGION, credentials: fromIni({ profile: 'default' }) });

    var deleteParams = {
        QueueUrl: QUEUEURL,
        ReceiptHandle: rHandle,
    }
    try {
        const data = await sqs.send(new DeleteMessageCommand(deleteParams));
        console.log("Message Deleted", data);
    } catch (err) {
        console.log("error in deleting", err);
    }
}

module.exports = Object.assign({ receiveMessage, deleteMessage });