const express = require("express");
const router = express();
const controllers = require('./controllers/controllers')
const passport = require('passport')

router.use(express.static("public"));
//RUTAS
router.get("/css/styles.css", (req, res) => {
    res.sendFile(__dirname + "/public/css/styles.css");
});
router.get("js/app.js", (req, res) => {
    res.sendFile(__dirname + "/public/js/app.js");
});

/*  router.get('/', controllers.fillDb) 
 */
 router.get('/', (req, res) => {
    res.redirect('/home')
}) 

router.get('/home', controllers.homeFeed)
// USER PROFILE
router.get('/profile/:username', controllers.getUserProfile)

// Twitealo ruta
router.post('/twitealo', controllers.isLoggedIn, controllers.createTwit)

// Follow someone 
router.post('/follow', controllers.isLoggedIn, controllers.addToFollowing)

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