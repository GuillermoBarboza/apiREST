const mongoose = require('../db');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    description: String,
    avatar: String,
    tweets: [{ types: Schema.Types.ObjectId, ref: 'Tweet'}],
    following: [{ types: Schema.Types.ObjectId, ref: 'User'}],
    followers: [{ types: Schema.Types.ObjectId, ref: 'User'}],
})



module.exports = mongoose.model('User', userSchema)