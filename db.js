const mongoose = require("mongoose");
require('dotenv').config();


mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

mongoose.connect(process.env.CONNECTION_STRING);




module.exports = mongoose;