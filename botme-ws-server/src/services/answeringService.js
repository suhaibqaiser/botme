const restaurantService = require('./restaurantService')

async function generateAnswer(input) {
    // TODO: list of intents in RASA need to get from DB
    let intents = ['Order_meal', 'menu_list', 'menu_category', 'page_navigation']
    console.log(input);
    let intent = input.intent
    let entities = input.entities
    let answer = {
        text: "",
        ctaId: ""
    }

    // check if identified intent exists in intents list above
    if (intents.includes(intent)) {

        // Intent based implementation
        if (intent === 'Order_meal') {

            let product = await restaurantService.getProductByName(entities[0].value)
            if (product.status === 'success') {
                if (product.payload.length === 1) {
                    answer.ctaId = product.payload[0].productId
                    answer.text = `I have added ${product.payload[0].productName} to your cart`
                } else if (product.payload.length > 1) {
                    answer.text = `Lets see what we've got in ${entities[0].value}`
                    answer.searchText = entities[0].value
                } else {
                    answer.text = "I didnt get the name of item, can you say that again?"
                }
            } else {
                answer.text = "I didnt get the name of item, can you say that again?"
            }
        }


        if (intent === 'page_navigation') {
            answer.navLink = entities[0].value
            answer.text = "Lets go..."
        }       

    } else {
        // fall back answer intent is not recognized
        (answer.text === "") ? answer.text = "I didnt get that... Will you tell me that again?" : null;
    }
    return answer
}

module.exports = ({ generateAnswer })