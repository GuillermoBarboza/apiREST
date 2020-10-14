const User = require('../models/User')
const faker = require('faker')


module.exports = {
    controllers: (req, res) => {
        /* for (let i = 0; i < 20; i++) {
            let user = new User({
              firstname: faker.name.firstName(),
              lastname: faker.name.lastName(),
              username: faker.internet.userName(),
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
    }
}