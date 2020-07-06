require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//configuracion Global de rutas
app.use(require('./routes/index'));

app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Base de datos Online');
});
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto ' + process.env.PORT);
});