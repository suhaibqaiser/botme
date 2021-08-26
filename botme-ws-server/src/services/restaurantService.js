const config = require('../config');
const fetch = require('node-fetch');

// Fetching various objects from Database 

async function getProductByName(productName) {
    try {
        const response = await fetch(config.restaurantAPI + `/food/product/search?searchText=${productName}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        data = await response.json();
    } catch (err) {
        console.log(err);
    }
    return data
}

module.exports = ({getProductByName})