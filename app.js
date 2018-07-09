const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js')
const keys = require('./configs/keys');

const app = express();
const port = keys.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

var server = app.listen(port, function() {
    console.log('App running on port ', server.address().port);
});
