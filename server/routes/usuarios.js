const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuarios');
const app = express();

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 0;

    desde = Number(desde);
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            })


        })
});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })


});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    estado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, estado, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioDB
            });

        })
        // Usuario.findByIdAndDelete(id, (err, usuario) => {
        //     if (err) {
        //         return res.status(400).json({
        //             ok: false,
        //             err
        //         });
        //     }
        //     if (usuario === null) {
        //         return res.status(400).json({
        //             ok: false,
        //             error: {
        //                 message: 'Usuario no encontrado'
        //             }
        //         });
        //     }
        //     res.json({
        //         ok: true,
        //         usuario
        //     })
        // });
});
module.exports = app;