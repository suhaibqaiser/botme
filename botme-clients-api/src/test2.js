const { NlpManager, ConversationContext } = require('node-nlp')
const readline = require('readline')
const ri = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false })

const languages = ['en']
const m = new NlpManager({ languages })

m.addNamedEntityText('action', 'find gate', languages, ['find gate', 'to find gate'])
m.addNamedEntityText('action', 'search gate', languages, ['search gate', 'to search gate'])
m.addNamedEntityText('action', 'locate gate', languages, ['locate gate', 'to locate gate'])
m.addRegexEntity('gate', languages, /@[0-9]+/g)

m.addDocument('en', 'I want to %action% %gate%', 'member.act')
m.addDocument('en', 'I wanna %action% %gate%', 'member.act')
m.addDocument('en', '%action% %gate%', 'member.act')

m.addAnswer('en', 'member.act', 'you asked {{action}} number {{gate}}?')

m.slotManager.addSlot('member.act', 'gate', true, {
    en: 'which gate number should I {{action}}?',
})
m.slotManager.addSlot('member.act', 'action', true, {
    en: 'what shoud I do to gate number {{member}}?',
})

async function main() {
    await m.train()
    m.save()
    console.log('you may type now')
    const context = new ConversationContext()
    ri.on('line', async (line) => {
        if (line == 'quit') process.exit()
        console.log('> ' + line)
        try {
            const response = await m.process(null, line, context)
            console.log('BOT:', JSON.stringify(response.answer, null, 2))
        } catch (err) {
            console.error(err)
            process.exit()
        }
    })
}

main()