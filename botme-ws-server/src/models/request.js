class Request {
    constructor(payload) {
        try {
            payload = JSON.parse(payload);
            this.clientID = payload.clientID,
                this.current_time = payload.current_time,
                this.message_format = payload.message_format,
                this.message_command = payload.message_command,
                this.language = payload.language,
                this.message_text = payload.message_text,
                this.authToken = payload.authToken
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = Request;