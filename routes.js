const express = require("express");
const router = express();
const controllers = require('./controllers/controllers')
const passport = require('passport')
//RUTAS
router.get("/articulo/:id/css/styles.css", (req, res) => {
    res.sendFile(__dirname + "/public/css/styles.css");
});
router.get("/articulo/:id/js/app.js", (req, res) => {
    res.sendFile(__dirname + "/public/css/styles.css");
});

router.get('/', (req, res) => {
    res.redirect("/home")
})

router.get('/home', (req, res) => {
    console.log(req.session)
    let user = false
    if(req.session.passport != undefined) {
        user = req.session.passport.user
    }
    res.render('home', {user})
})

// Login routes
router.get('/login', (req, res) =>{
    res.render('login')
})
router.post('/login', controllers.signIn)
router.get("/logout", controllers.logout);

// sign up routes
router.get('/registro', (req, res) =>{
    res.render('register')
})
router.post("/registro", controllers.signUp)


module.exports = router;