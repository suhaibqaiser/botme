export interface Corpus {
  corpusId: string,
  name: string,
  comment: string,
  locale: string,
  created: Date,
  updated: Date,
  active: Boolean,
  nlu: {
    intents: [{ name: string, examples: [string] }],
    lookups: [{ name: string, examples: [string] }],
    synonyms: [{ name: string, examples: [string] }],
    regexes: [{ name: string, examples: [string] }]
  }
}
