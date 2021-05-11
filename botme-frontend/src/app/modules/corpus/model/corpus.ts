export interface Corpus {
  corpusId: String,
  active: Boolean,
  comment: String,
  name: String,
  locale: String,
  data: [{
    intent: String,
    utterance: [String],
    answers: [{
      answer: string,
      opts: String
    }]
  }],
  contextData: {}
}
