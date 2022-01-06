export interface Corpus {
  corpusId: String,
  name: String,
  comment: String,
  locale: String,
  created: Date,
  updated: Date,
  active: Boolean,
  nlu: {
    intents: [{ name: String, examples: [String] }],
    lookups: [{ name: String, examples: [String] }],
    synonyms: [{ name: String, examples: [String] }],
    regexes: [{ name: String, examples: [String] }]
  }
}
