let test = require('./server/services/brugere');

test.find_uniq('jens').then(result => {
    console.log(result);
})