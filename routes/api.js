const usuariosRouter = require('./usuarios');
const loginRouter = require('./login');
const gastosRouter = require('./gastos');
const express = require('express');

var app = express();

app.use('/usuarios', usuariosRouter);
app.use('/login', loginRouter);
app.use('/gastos', gastosRouter);

module.exports = app;