export interface Conversation {
  conversationId: { type: String, index: true },
  conversationStart: Date,
  conversationEnd: Date,
  conversationActive: Boolean,
  conversationRating: Number,
  conversationLog: [{
    query: String,
    response: String,
    timeStamp: Date
  }]
}
