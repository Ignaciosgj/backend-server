const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const getUsuarios = async (req, res) => {
    const usuarios = await Usuario.find( {}, 'nombre email role google' );
    res.json({
        ok: true,
        usuarios
    });
}

const crearUsuario = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });
        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'el correo ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );
        // Se encripta la contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
        await usuario.save();

        res.json({
            ok: true,
            usuario
        }); 
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const actualizarUsuario = async(req, res = response) => {
    // TODO: VALIDAR TOKEN
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById( uid )
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario por ese id'
            });
        }
        
        const { password, google, email, ...campos } = req.body;
        if ( usuarioDB.email !== email ) {
            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        campos. email = email;
        const usuarioActualizado = await Usuario.findOneAndUpdate( req.body.id = uid, campos, {new: true});

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById( uid );
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario por ese id'
            });
        }
        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}