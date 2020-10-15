const User = require('../models/User');
const Twit = require('../models/Twit')
const faker = require('faker')
const passport = require("passport")
const bcrypt = require('bcryptjs')

function randomDate(start, end, startHour, endHour) {
    var date = new Date(+start + Math.random() * (end - start));
    var hour = startHour + Math.random() * (endHour - startHour) | 0;
    date.setHours(hour);
    return date;
  }


module.exports = {
    fillDb: (req, res) => {
        for (let i = 0; i < 20; i++) {
            let user = new User({
              firstname: faker.name.firstName(),
              lastname: faker.name.lastName(),
              username: faker.internet.userName(),
              password: bcrypt.hashSync(faker.lorem.word(), 10),
              email: faker.internet.email(),
              description: faker.lorem.sentence(),
              avatar: faker.image.avatar(),
            });
            
            user.save();
            for (let i = 0; i < 20; i++) {
                let twit = new Twit({
                    author: user._id,
                    body: faker.lorem.paragraph(),
                    dateOfCreation: randomDate(new Date(2020, 0, 1), new Date(), 0, 24),
                    likes: 0,
                });

                twit.save(function(err, twit) {
                    User.findById(user._id, function(err, user) {
                      user.twits.push(twit);
                      user.save();
                    });
                  });
            }
            
          }
        console.log('back end log')
        res.send('ok en tu front')
    },

    homeFeed: (req, res) => {
        console.log(req.session);
        
        let user = false
        if(req.isAuthenticated()) {
            let following = req.session.passport.user.following;
            user = req.session.passport.user
            Twit.find({author: {$in: following} })
            .limit(20)
            .sort('-dateOfCreation')
            .populate('author')
            .then(feedResults => {
                res.render('home', {user, feedResults})
            })
        } else {
            res.render('home', {user})
        }
        
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
            //console.log("author id", req.body.author);
            //console.log('twit', twit);
            
            User.findById(req.body.author, function(err, user) {
              if (err) return res.send(err);
              //console.log("user",user);
              
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
        .populate('twits')
        .then(user => {
            
            //console.log(user);
            res.render('user-profile', {user})
        })
    },

    addToFollowing: (req, res) => {
        //console.log(req.session);
        let newFollowing = req.body.author;
        
        User.findById(req.session.passport.user._id, function(err, user) {
            if (err) return res.send(err);
            
            
            user.following.push(newFollowing);
            user.save();
          });
        User.findById(newFollowing, function(err, user) {
            if (err) return res.send(err);
            
            
            user.followers.push(req.session.passport.user._id);
            user.save();
          });
        

        res.redirect('back')
    },

    logout: function (req, res) {
      req.logout();
      res.redirect("/login");
    },

    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
          return next();
        } else {
          return res.redirect("/login");
        }
      } 
  
  }