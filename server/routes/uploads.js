const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const Usuario = require('../models/usuarios');
const Producto = require('../models/producto');

app.use(fileUpload({ useTempFiles: true }));

app.put('/uploads/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            message: 'No files were uploaded.'
        });
    }

    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    // Extenciiones permitidas

    let extencionesValidas = ['jpg', 'png', 'gif', 'jpeg'];
    let nombreCortado = archivo.name.split('.');

    let extencion = nombreCortado[nombreCortado.length - 1];

    if (extencionesValidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            er: {
                message: 'las extenciones validas son ' + extencionesValidas.join(', '),
                ext: extencion
            }
        })
    }


    // Validar tipo
    let tiposValidos = ['usuarios', 'productos'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            er: {
                message: 'los tipos validos son ' + tiposValidos.join(', '),
                tipo: tipo
            }
        })
    }

    // Nombre del Archivo

    let nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${ extencion }`;



    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, function(err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo, tipo);
        } else {
            imagenProducto(id, res, nombreArchivo, tipo);
        }



    });
});

function imagenUsuario(id, res, nombreArchivo, tipo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
            borarImagen(nombreArchivo, tipo);
        }

        if (!usuarioDB) {

            return res.status(400).json({
                ok: false,
                message: 'El usuario no existe'
            })
            borarImagen(nombreArchivo, tipo);

        }

        borarImagen(usuarioDB.img, tipo);

        usuarioDB.img = nombreArchivo;




        usuarioDB.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    })

}

function borarImagen(nombreImagen, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

function imagenProducto(id, res, nombreArchivo, tipo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
            borarImagen(nombreArchivo, tipo);
        }

        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            });
            borarImagen(nombreArchivo, tipo);

        }

        borarImagen(productoDB.img, tipo);

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });

}
module.exports = app;