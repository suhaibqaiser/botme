export interface ISession {
  clientID: {type: String, maxlength: 256, required: true},
  clientToken: {type: String, maxlength: 256, required: true, unique: true},
  sessionId: {type:String, maxlength: 256, required: true},
  sessionCreated: {type: Date, required: true},
  sessionUpdated: {type: Date},
  sessionActive: {type: Boolean, required: true, index: true},
  conversations: [{
    conversationId: {type: String, index: true},
    conversationStart: Date,
    conversationEnd: Date,
    conversationActive: Boolean,
    conversationRating: Number,
    conversationLog: [{
      query: String,
      response: String,
      timeStamp: Date
    }]
  }]
}
