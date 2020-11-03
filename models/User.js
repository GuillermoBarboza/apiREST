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
    twits: [{ type: Schema.Types.ObjectId, ref: 'Twit'}],
    following: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    token: String,
})



module.exports = mongoose.model('User', userSchema)
