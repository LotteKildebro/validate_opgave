// indlæs express
const express = require('express');
const app = express();


// knyt morgan til som logger
const logger = require('morgan');
app.use(logger('dev'));


// sæt view-engine op til at benytte ejs
app.set('view engine', 'ejs'); // definer template engine
app.set('views', './server/views'); // definerer hvor ejs filerne er placeret
app.engine('ejs', require('express-ejs-extend')); // tillad extends i ejs templates

// konfigurer bodyparser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

require('./routes/brugere.js')(app);
app.use(express.static('public'));

// start serveren på en port
const port = 3000;
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('App is listening on http://localhost:' + port);
});