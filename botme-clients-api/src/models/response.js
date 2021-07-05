class Response {
    constructor(data) {
        try {
            if (!data) {
                this.payload = "",
                    this.status = "",
                    this.timestamp = Date()
            } else {
                data = JSON.parse(data);
                this.payload = payload.payload,
                    this.status = payload.status,
                    this.timestamp = Date()
            }
        } catch (err) {
            console.log(err)
        }
    }

}

module.exports = Response;