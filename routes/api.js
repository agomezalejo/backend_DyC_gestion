const usuariosRouter = require('./usuarios');
const loginRouter = require('./login');
const express = require('express');

var app = express();

app.use('/usuarios',usuariosRouter);
app.use('/login',loginRouter);

module.exports = app;