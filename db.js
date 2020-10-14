const mongoose = require("mongoose");



mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

mongoose.connect(`mongodb://localhost/${process.env.DATABASE_NAME}`);




module.exports = mongoose;