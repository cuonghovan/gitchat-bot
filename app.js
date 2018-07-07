const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js')

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

var server = app.listen(port, function() {
    console.log('app running on port.', server.address().port);
});
