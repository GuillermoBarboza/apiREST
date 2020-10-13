const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    description: String,
    avatar: String,
    tweets: [],
    following: [],
    followers: [],
})

module.exports = mongoose.model('User', userSchema);