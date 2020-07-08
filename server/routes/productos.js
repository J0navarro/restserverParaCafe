const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

const Producto = require('../models/producto');

const app = express();

//=================================
// Consultar productos disponibles
//=================================

app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 0;

    desde = Number(desde);
    limite = Number(limite);


    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productoDB
            })

        })
});

//=================================
// Consultar un producto por id
//=================================

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productoDB
            })
        })
})

//=================================
// Consultar un producto por nombre
//=================================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productoDB
            })
        })
})

//=================================
// Crear Producto
//=================================

app.post('/producto', verificaToken, (req, res) => {

    let idUsuario = req.usuario._id;
    let body = req.body;


    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: idUsuario
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productoDB
        });
    })
})

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let idUsuario = req.usuario._id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }

        productoDB.nombre = body.nombre,
            productoDB.precioUni = body.precioUni,
            productoDB.descripcion = body.descripcion,
            productoDB.categoria = body.categoria,
            productoDB.usuario = idUsuario

        productoDB.save((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productoDB
            });
        });
    })
})


app.delete('/producto/:id', verificaToken, function(req, res) {

    let id = req.params.id;

    let disponible = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, disponible, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: productoDB
        });

    })

});


module.exports = app;