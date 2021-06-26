const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RestaurantSchema = new Schema(
    {
        restaurantId: {type: String, maxlength: 256, required: true, unique: true},
        restaurantName: {type: String, maxlength: 256, required: true, unique: true},
        restaurantActive: {type: Boolean, required: true}
    }
);

module.exports = mongoose.model('Restaurant', RestaurantSchema);