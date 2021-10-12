class Request {
    constructor(payload) {
        try {
            if (payload) {
                payload = JSON.parse(payload);
                this.clientID = payload.clientID,
                    this.current_time = payload.current_time,
                    this.message_format = payload.message_format,
                    this.message_command = payload.message_command,
                    this.language = payload.language,
                    this.message_text = payload.message_text,
                    this.authToken = payload.authToken,
                    this.pageId = payload.pageId,
                    this.sectionId = payload.sectionId
            } else {
                this.clientID = '',
                    this.current_time = '',
                    this.message_format = '',
                    this.message_command = '',
                    this.language = '',
                    this.message_text = '',
                    this.authToken = '',
                    this.pageId = '',
                    this.sectionId = ''
            }
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = Request;
