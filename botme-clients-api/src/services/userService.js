const User = require('../models/user')

async function getUserByUsername(username) {
    return User.findOne({ userName: username }, { _id: 0, __v: 0 });
}

async function getUserByUserId(userId) {
    return User.findOne({ userId: userId }, { _id: 0, __v: 0 });
}

async function getUsers() {
    return User.find({}, { _id: 0, __v: 0 });
}

async function getUsersByRestaurantId(restaurantId) {
    return User.find({ restaurantId: restaurantId }, { _id: 0, __v: 0 });
}
async function checkIfUserExists(userName){
    return User.exists({userName: userName})
}

async function addUser(user) {
    return User.create(user);
}

async function updateUser(user) {
    return User.findOneAndUpdate({ userId: user.userId }, user, { new: true })
}

async function getUsersByEmail(userEmail) {
    return User.findOne({ userEmail: userEmail }, { _id: 0, __v: 0 });
}

async function deleteUser(userId) {
    return User.findOneAndDelete({userId: userId})
}

module.exports = ({ getUserByUsername, getUsers, getUsersByRestaurantId, updateUser, addUser, getUserByUserId, getUsersByEmail, deleteUser, checkIfUserExists })