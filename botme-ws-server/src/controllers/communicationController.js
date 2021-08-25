const session = require("../controllers/sessionsController");
const Request = require("../models/request");
const Response = require("../models/response");
const commService = require("../services/communicationService");
const conversationController = require("../controllers/conversationController");
const { rasaApi } = require("../config");
const { rasaProcess } = require("../services/communicationService");
const fetch = require('node-fetch');
const config = require('../config');
const {getCta} = require('../services/ctaService');
const {getItem} = require('../services/ctaService');


async function processCommunication(payload) {
    let response = new Response();

    if (!payload) {
        response.status = "error";
        response.message = "Error: Cannot process empty request";
        return response
    }
    let request = new Request(payload);

    if (!request.message_text) {
        response.status = "error";
        response.message = "Error: Request not properly formatted";
        return response
    }

    if (!request.authToken) {
        response.status = "error";
        response.message = "Error: Authentication token not found";
        return response
    }

    let sessionStatus = await session.validateSession(request.authToken);
    if (
        sessionStatus.status === "success" &&
        sessionStatus.payload === true
    ) {
        let reply = await processConversation(request.message_text, request.authToken);
        response.message = reply.payload;
        response.status = reply.status;
    } else {
        response.message = sessionStatus.payload;
        response.status = sessionStatus.status;
    }
    return response;
}

async function processConversation(message, clientToken) {
    let response = {
        status: "",
        payload: ""
    };

    let communication = await processMessage(message)
    if (communication.status === 'error') {
        response.status = communication.status
    } else {
        response.status = communication.status
        response.payload = communication.payload
    }

    let conversationId = await conversationController.getConversationId(clientToken)
    console.log(communication.intent)
    if (communication.intent === 'conversation.end') {
        conversationController.addConversationLog(conversationId, message, communication.payload)
        conversationController.endConversation(conversationId,0)
    } else {
        conversationController.addConversationLog(conversationId, message, communication.payload)
    }
    return response
}

async function processMessage(text) {
    let response = {
        status: "",
        payload: ""
    };

    let message = await commService.process(text);
    if (message) {
        response.payload = message.payload;
        //response.intent = message.intent;
        response.status = message.status;
    } else {
        response.status = "error";
        response.payload = "Error: There is an error in communication api";
    }
    return response;
}
async function processRasa(payload) {
    let response = new Response();

    if (!payload) {
        response.status = "error";
        response.message = "Error: Cannot process empty request";
        return response
    }
    let request = new Request(payload);

    if (!request.message_text) {
        response.status = "error";
        response.message = "Error: Request not properly formatted";
        return response
    }

     let sessionStatus = await session.validateSession(request.authToken);
     if (
        sessionStatus.status === "success" &&
        sessionStatus.payload === true
    ) {
        
        let reply = await rasaProcess(request.message_text);
        console.log(reply);
        let searchResult = await getCta(reply.intent.name)
        // console.log(searchResult);

        if (searchResult && searchResult.length > 0 && reply.intent.name == "greet_one" || reply.intent.name == "greet_two" || reply.intent.name == "greet_three" || reply.intent.name == "greet_four")
        {
            if(searchResult[0].intentName == "greet_one" )
            {
                reply.anwser = searchResult[0].responseMessage;
            }
            else if(searchResult[0].intentName == "greet_two" )
            {
                reply.anwser = searchResult[0].responseMessage;
            }
            else if(searchResult[0].intentName == "greet_three" )
            {
                reply.anwser = searchResult[0].responseMessage;
            }
            else if(searchResult[0].intentName == "greet_four" )
            {
                reply.anwser = searchResult[0].responseMessage;
            }
        }
        else if(searchResult && searchResult.length > 0 && reply.intent.name == "menu_category" || reply.intent.name == "menu_list")
        {
            if(searchResult[0].intentName == "menu_category")
            {
                var item = await productResponse(searchResult,reply.entities[0].value);
                var cate = await getItem(item[0].productId);
                var pn = await getProduct(cate)
                reply.anwser = item[0].responseMessage + " => " + pn.join(",")
            }
            else if(searchResult[0].intentName == "menu_list")
            {
                var cate = await getItem(searchResult[0].productId);
                var pn = await getProduct(cate)
                reply.anwser = searchResult[0].responseMessage + " => " + pn.join(",")
            }

        }
        else if (searchResult && searchResult.length > 0 && searchResult[0].intentName == "Order_meal")
        {
            if(searchResult[0].intentName == "Order_meal")
            {
                var productName = reply.entities[0].value
                const resp = await fetch(config.restuarantApi + 'food/product/search?searchText=' + productName)
                data = await resp.json()
                if(data.status == 'success')
                {
                    if(data.payload.length == 1)
                    {
                        let text = data.payload[0].productName;
                        var result =await processCtaResponse(searchResult,text)
                        reply.anwser = result[0].responseMessage + " CtaiD: " + result[0].ctaCommandId;
                    }
                    else if(data.payload.length > 1)
                    {
                        var allproduct = await allProduct(data.payload)
                        reply.anwser = "Here are all product with name " + reply.entities[0].value + " => " + allproduct.join(",")
                    }
                    else
                    {
                        reply.anwser = "Product not found"
                    } 
                }
            }
        }
         response.message = reply.anwser;
         response.status = reply.status;
    } else {
        response.message = sessionStatus.payload;
        response.status = sessionStatus.status;
    }
    return response;
}
async function processCtaResponse(searchResult,text){
    let arr = [];
    for (let i=0;i<searchResult.length;i++){
        if(searchResult[i].productName == text)
        {
            arr.push(searchResult[i])
        }
    }
    return arr;
}
async function productResponse(search,text){
    let arr = [];
    for (let i=0;i<search.length;i++)
    {
        if(search[i].productName.toLowerCase() == text.toLowerCase())
        {
            arr.push(search[i])
        }
    }
    return arr;
}
async function getProduct(items){
    let arr = [];
    for (let i=0;i<items.length;i++)
    {
            arr.push(items[i].productName)
    }
    return arr;
}
async function allProduct(products){
    let arr = [];
    for (let i=0;i<products.length;i++)
    {
            arr.push(products[i].productName)
    }
    return arr;
}
module.exports = {processCommunication,processRasa};
