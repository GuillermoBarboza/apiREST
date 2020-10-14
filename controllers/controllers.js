const User = require('../models/User')
const faker = require('faker')
const passport = require("passport")



module.exports = {
    controllers: (req, res) => {
        /* for (let i = 0; i < 20; i++) {
            let user = new User({
              firstname: faker.name.firstName(),
              lastname: faker.name.lastName(),
              username: faker.internet.userName(),
              password: faker.lorem.word()
              email: faker.internet.email(),
              description: faker.lorem.sentence(),
              avatar: faker.image.avatar(),
              tweets: [],
              following: [],
              followers: [],
            });
            console.log('user creado')
            
            user.save();
            console.log(user);
            
          } */
        console.log('back end log')
        res.send('ok en tu front')
    },
    
    signIn: passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/login",
      }),

    signUp:  (req, res) => {
      const user = new User({        
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
        },
        
      );
      user.save()
      res.redirect("/home")
      
    },
  }