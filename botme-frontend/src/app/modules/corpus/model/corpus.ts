export interface Corpus {
  corpusId: String,
  active: Boolean,
  comment: String,
  name: String,
  locale: String,
  data: [{
    intent: String,
    utterances: [String],
    answers: [{
      answer: string,
      opts: String
    }]
  }],
  contextData: {}
}
