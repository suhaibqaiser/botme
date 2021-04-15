const { NlpManager } = require('node-nlp');

async function main() {
    const manager = new NlpManager({ languages: ['en'] });
    const fromEntity = manager.addTrimEntity('fromCity');
    fromEntity.addBetweenCondition('en', 'from', 'to');
    fromEntity.addAfterLastCondition('en', 'from');
    const toEntity = manager.addTrimEntity('toCity');
    toEntity.addBetweenCondition('en', 'to', 'from', { skip: ['travel'] });
    toEntity.addAfterLastCondition('en', 'to');

    manager.slotManager.addSlot('travel', 'fromCity', true, { en: 'From where you are traveling?' });
    manager.slotManager.addSlot('travel', 'toCity', true, { en: 'Where do you want to go?' });
    manager.slotManager.addSlot('travel', 'date', true, { en: 'When do you want to travel?' });


    manager.addDocument('en', 'I want to travel from %fromCity% to %toCity% %date%', 'travel');
    await manager.train();
    const result = await manager.process('en', 'I want to travel to Madrid', {});
    console.log(JSON.stringify(result, null, 2));
}

main();