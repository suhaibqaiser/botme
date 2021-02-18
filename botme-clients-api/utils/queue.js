const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
const REGION = "us-east-1";
const QUEUEURL = "https://sqs.us-east-1.amazonaws.com/378223624719/BotMe_Commands";

var queueMessage = async function (clientID, command) {
    console.log(clientID, command);
    const params = {
        //DelaySeconds: 10,
        MessageAttributes: {
            clientID: {
                DataType: "String",
                StringValue: clientID,
            },
            timestamp: {
                DataType: "String",
                StringValue: Date(),
            }
        },
        MessageBody: command,
        QueueUrl: QUEUEURL,
    };

    const sqs = new SQSClient({ region: REGION, credentials: fromIni({ profile: 'default' }) });

    try {
        const data = await sqs.send(new SendMessageCommand(params));
        return { status: 200, message: data.MessageId }
    } catch (err) {
        return { status: 403, message: err };
    }

}
module.exports = Object.assign({ queueMessage });