const User = require('../models/User');
const Twit = require('../models/Twit')
const faker = require('faker')
const passport = require("passport")
const bcrypt = require('bcryptjs')
const formidable = require('formidable')

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
        
        let userSession = {
          _id: "voidUsername",
          following: [],
          likes: [],
        };
        if(req.isAuthenticated()) {
            User.findById(req.session.passport.user._id)
            .then(loggedUser => {
                Twit.find({author: {$in: loggedUser.following} })
                .limit(20)
                .sort('-dateOfCreation')
                .populate('author')
                //.populate('likes')
                .then(feedResults => {
                    res.render('home', {userSession: loggedUser, feedResults})
                })
            }) 
        } else {
            res.render('home', {userSession})
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
          avatar: "https://cms.qz.com/wp-content/uploads/2017/03/twitter_egg_blue.png?w=1100&h=619&strip=all&quality=75",
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
        let userSession = {
          _id: "voidUsername",
          following: [],
          likes: [],
        };
        if (req.isAuthenticated()) {
          userSession = req.session.passport.user;
        }
        User.findById(userSession._id)
        .then(result => {
          if (result != null) {
            userSession = result;
          }
          
          
          User.findOne({username})
          .populate('twits')
          .then(userProfile => {
          res.render('user-profile', {userProfile, userSession})
        })
        })
        
    },

    like: (req, res) => {
        let newLike = req.body.author;
        console.log(" new like" , newLike);
        
        
        Twit.findById(newLike)
        .then(twit => {
            console.log(twit);
            
            if (twit.likes.indexOf(req.session.passport.user._id) != -1) {
                twit.likes.splice(twit.likes.indexOf(req.session.passport.user._id), 1)
                twit.markModified('twit.likes')
                twit.save();
                res.redirect('/')
                
            } else {
                twit.likes.push(req.session.passport.user._id);
                twit.markModified('twit.likes')
                twit.save();
                res.redirect('/')
            }
            
        })
        
        
    },

    followUnfollow: (req, res) => {
        //console.log(req.session);
        let newFollowing = req.body.author;
        
        User.findById(req.session.passport.user._id, function(err, user) {
            if (err) return res.send(err);

            if (user.following.indexOf(newFollowing) != -1) {
                user.following.splice(user.following.indexOf(req.session.passport.user._id), 1)
                user.markModified('user.following')
                user.save();
                
                
            } else {
                user.following.push(newFollowing);
                user.markModified('user.following')
                user.save();
                
            }
        });
        User.findById(newFollowing, function(err, user) {
            if (err) return res.send(err);

            if (user.followers.indexOf(req.session.passport.user._id) != -1) {
                user.followers.splice(user.followers.indexOf(newFollowing), 1)
                user.markModified('user.followers')
                user.save();
                
                
            } else {
                user.followers.push(req.session.passport.user._id);
                user.markModified('user.followers')
                user.save();
                
            }
        });

        res.redirect('/')
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
      }, 

      deleteTwit: async (req, res) => {
        const twit = await Twit.findById(req.params.id.toString());
        await Twit.deleteOne({ _id: req.params.id.toString()});
        const user = await User.findById(twit.author._id);
        const index = user.twits.indexOf(req.params.id.toString());
        user.twits.splice(index,1);
        user.save()
        res.redirect("back")
      },

     //change profile picture
     changeProfilePicture: (req, res) => {

     }
  }


           