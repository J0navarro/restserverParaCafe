require('./config/config');
const express = require('express');
const app = express();


const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { routes } = require('./routes/usuarios');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('./routes/usuarios'));

// parse application/json
app.use(bodyParser.json())



mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Base de datos Online');
});
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto ' + process.env.PORT);
});