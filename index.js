require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config')

// Crear servidor de express
const app = express();

// Configurar cors
app.use( cors() );


// Base de datos
dbConnection();

//BiF6h8gNG1s40mSc
//user

// Rutas
app.get( '/', (req, res) => {
    // res.status(400).json({})
    res.json({
        ok: true,
        msg: 'Hola mundo'
    })
});


app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});
