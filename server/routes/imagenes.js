const express = require('express');
const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/autenticacion');
const app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let img = req.params.img;
    let tipo = req.params.tipo;

    let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
    let pathNoImg = path.resolve(__dirname, `../assets/img/no-image.jpg`);
    if (fs.existsSync(pathImg)) {
        return res.sendFile(pathImg);
    }

    res.sendFile(pathNoImg);
})

module.exports = app;