class Request {
    constructor(payload) {
        try {
            if (payload) {
                //payload = JSON.parse(payload);
                    this.current_time = payload.current_time,
                    this.text = payload.text,
                    this.pageId = payload.pageId,
                    this.sectionId = payload.sectionId
            } else {
                    this.current_time = '',
                    this.text = '',
                    this.pageId = '',
                    this.sectionId = ''
            }
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = Request;
