const express = require("express");
const router = express();
const controllers = require("./controllers/controllers");
const path = require("path");
const jwtMiddleware = require("express-jwt");

//RUTAS
router.get("/css/styles.css", (req, res) => {
  res.sendFile(__dirname + "/public/css/styles.css");
});
router.get("js/app.js", (req, res) => {
  res.sendFile(__dirname + "/public/js/app.js");
});

/* router.get('/', controllers.fillDb)  */

/* RUTAS API */
//RUTAS / TWITS
router.get(
  "/api/twits/feed",
  jwtMiddleware({ secret: process.env.JWTKEY, algorithms: ["HS256"] }),
  controllers.homeFeed
);

router.post(
  "/api/twits",
  jwtMiddleware({ secret: process.env.JWTKEY, algorithms: ["HS256"] }),
  controllers.createTwit
);

// Twitealo ruta creat twit
router.post(
  "/api/twits/twitealo",
  controllers.isLoggedIn,
  controllers.createTwit
);

//delete twit
router.get(
  "/api/twits/eliminar/:id",
  controllers.isLoggedIn,
  controllers.deleteTwit
);

// LIKES
router.post("api/twits/like", controllers.isLoggedIn, controllers.like);

router.get("/api/profile");
//

// RUTAS /USER

//LOGIN
router.post("/api/users/login", controllers.signIn);
router.get("/login", controllers.logInView);
//LOGOUT
router.get("/logout", controllers.logout);
//REGISTRO
router.post("/api/users/registro", controllers.signUp);
router.get("/registro", controllers.registerView);
// discover users route
router.get("/api/users/discover", controllers.discoverFeed);
// USER PROFILE
router.get("api/users/profile/:username", controllers.getUserProfile);
// settings
router.get("api/users/settings", controllers.userSettings);
// Follow someone
router.post(
  "api/users/follow",
  controllers.isLoggedIn,
  controllers.followUnfollow
);

// sign up routes

module.exports = router;
