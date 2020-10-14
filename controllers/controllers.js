const User = require('../models/User');
const Twit = require('../models/Twit')
const faker = require('faker')
const passport = require("passport")
const bcrypt = require('bcryptjs')



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
      const password = bcrypt.hashSync(req.body.password, 10);
      const user = new User({        
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username,
          password: password,
          email: req.body.email,
        },
        
      );
      user.save()
      res.redirect("/home")
      
    },

    createTwit: (req, res) =>{
        console.log(req.body);
        
        const twit = new Twit(
            req.body,
        );
        twit.save(function(err, twit) {
            if (err) return res.send(err);
            console.log("author id", req.body.author);
            console.log('twit', twit);
            
            User.findById(req.body.author, function(err, user) {
              if (err) return res.send(err);
              console.log("user",user);
              
              user.twits.push(twit);
              user.save();
            });
          });
        res.redirect("/home")
        
    },

    getUserProfile: (req, res) => {
        //console.log(req.params)
        let username = req.params.username
        User.findOne({username})
        .then(user => {
            
            console.log(user);
            res.render('user-profile', {user})
        })
    },

    logout: function (req, res) {
      req.logout();
      res.redirect("/login");
    },

  
  }