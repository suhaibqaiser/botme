const User = require('../models/user')

async function getUser(user) {
    return User.findOne({userName: user.username}, {_id: 0, __v: 0});
}

function updateUser(user) {
    User.findOneAndUpdate({userId: user.userId}, user)
}

module.exports = ({getUser, updateUser})