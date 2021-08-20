const fetch = require('node-fetch');
const config = require('../config');


async function fetchProducts()  {
    await process()
    console.log("taha learning websocket");
}
async function process() {
    let data
    try {
        const response = await fetch(config.restuarantApi + 'dictionary/product/search')
        data = await response.json();
        // console.log(product[0].productName)
        // const productname = [];
        // for (let i=0;i<=product.length;i++){
        //     if(product[i].productName == 'Nacho'){
        //         productname.push(product[i]);
        //         console.log(productname[i].productName)
        //     }
        //     else{
        //         console.log("Product not found")
        //     }
        // }
        // // for (let x in data.payload){
        //     // var product = "";
        //     console.log(data.payload[x].productName)
                 
        
        // console.log(data.payload["productName"])
        // var product;
        // for (let x in data.payload){
        //     product +=data.payload[x];
        //     console.log(product);
        // }
        // console.log(data.payload.productName);
        // console.log(data.productName)
        let responsedata = await search('nacho', data)
        // console.log(responsedata)
    } catch (err) {
        console.log(err);
    }
    return data;
}
async function search(text ,data){
    // var arr = data.payload.filter(payload => payload.productName = text);
    // console.log(arr);
         //OR
    let prod = data.payload
    // console.log(data.payload)     
    let newlist = [];
    for (let j = prod.length-1;j >=0; j--){
        // console.log(prod[j].productName)
        if (prod[j].productName.toLowerCase().includes(text.toLowerCase())){
            newlist.push(prod[j]);     
        }
    }
    return newlist;
}

module.exports = {fetchProducts,process};
