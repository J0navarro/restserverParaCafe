const express = require('express');
const _ = require('underscore');

const Categoria = require('../models/categorias');
const { verificaToken, verificaAdmin_Rol } = require('../middlewares/autenticacion');

const app = express();

app.get('/categoria', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 0;

    desde = Number(desde);
    limite = Number(limite);



    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });

            })


        })
});

app.get('/categoria/:id', [verificaToken, verificaAdmin_Rol], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })


});

app.post('/categoria', [verificaToken, verificaAdmin_Rol], function(req, res) {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});

app.put('/categoria/:id', [verificaToken, verificaAdmin_Rol], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })


});

app.delete('/categoria/:id', verificaToken, function(req, res) {

    let id = req.params.id;

    // estado = {
    //     estado: false
    // }
    // Categoria.findByIdAndUpdate(id, estado, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err
    //             });
    //         }
    //         res.json({
    //             ok: true,
    //             categoria: categoriaDB
    //         });

    //     })
    Categoria.findByIdAndDelete(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (categoria === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })
    });
});
module.exports = app;