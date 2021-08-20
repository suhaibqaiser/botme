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
        //  console.log(reply);
        //  var productName = reply.entities[0].value
        //  const resp = await fetch(config.restuarantApi + 'food/product/search?searchText=' + productName)
        //  data = await resp.json()
        //  let msg = reply.intent.name
         let searchResult = await getCta(reply.intent.name)
         console.log(searchResult);
        //  let processArray = [];
        //  let text = data.payload[0].productName;
        //  for(let i=0;i<searchResult.length;i++)
        //  {
        if (searchResult && searchResult.length > 0 && searchResult[0].intentName == "Order_meal")
        {
             var productName = reply.entities[0].value
             const resp = await fetch(config.restuarantApi + 'food/product/search?searchText=' + productName)
             data = await resp.json()
             let text = data.payload[0].productName;
             var result =await processCtaResponse(searchResult,text)
             reply.anwser = result[0].responseMessage + " CtaiD: " + result[0].ctaCommandId;
            //  reply.anwser = processArray[0].responseMessage
        }
        else if(searchResult && searchResult.length > 0 && searchResult[0].intentName == "menu_list")
        {
            reply.anwser = searchResult[0].responseMessage;
        }
        else
        {
                reply.anwser = "Product not found";
        }
        //  }
        //  switch (msg){
            //  case 'greet':
                //  reply.anwser="Hey! How may i help you?"
                //  break;
            //  case 'Order_meal':
                // var productName = reply.entities[0].value
                // const resp = await fetch(config.restuarantApi + 'food/product/search?searchText=' + productName)
                // data = await resp.json()
                // let prod_name = [];
                // for(let i=0;i<=data.payload.length-1;i++){
                    // if (data.status === 'success'&& data.payload.length == 1)
                    // {
                        // var product_name = data.payload[0].productId
                        // let cta = await getCta(product_name)
                        // reply.anwser = cta[0].responseMessage
                    // }
                    // else if(data.payload.length > 1)
                    // {
                        // console.log(data.payload)
                        // 
                        // prod_name.push(data.payload[i].productName)
                        // console.log("taha")
                    // }
                // }
                // reply.anwser = "Which product you want " + prod_name.join(",");
                // break;
            //  default:
                //  console.log("Product not found")
            // }
        //  
        //  var productName = reply.entities[0].value
        // //  
        //  const resp = await fetch(config.restuarantApi + 'food/product/search?searchText=' + productName)
        // // 
        //  data = await resp.json()
        //  console.log(reply)
        // if(reply.intent.name === "greet"){
        //     reply.anwser = "Hey! How may i help you?"
        // }
        // // 
        // else if (data.status === 'success' && reply.intent.name === "Order_meal"){
        //      var productName = reply.entities[0].value
        //      const resp = await fetch(config.restuarantApi + 'food/product/search?searchText=' + productName)
        //      data = await resp.json()
        //      var product_name = data.payload[0].productId
        //      let cta = await getCta(product_name)
        //      reply.anwser = cta[0].responseMessage
        //  }
        // //  else if(){}
        //  else{
        //      reply.anwser = "Product not found"
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
module.exports = {processCommunication,processRasa};
