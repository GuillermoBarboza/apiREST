const mongoose = require('../db');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    email: String,
    description: String,
    avatar: String,
    tweets: [{ type: Schema.Types.ObjectId, ref: 'Tweet'}],
    following: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User'}],
})



module.exports = mongoose.model('User', userSchema)
