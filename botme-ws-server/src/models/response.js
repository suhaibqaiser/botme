class Response {
    constructor(payload) {
        try {
            if (!payload) {
                this.message = "",
                    this.status = "",
                    this.timestamp = Date()
            } else {
                payload = JSON.parse(payload);
                this.message = payload.message,
                    this.status = payload.status,
                    this.timestamp = Date()
            }
        } catch (err) {
            console.log(err)
        }
    }

}

module.exports = Response;