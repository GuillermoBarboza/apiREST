require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes')

const app = express();


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('view engine', 'ejs');

app.use(
    session({
        secret: 'twita',
        resave: true,
        saveUninitialized: true,// resave y save uninitialized
    }) 
)
app.use(routes)




app.listen(3000, () => {
    console.log("listening on 3000");
  });