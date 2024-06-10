const usuariosRouter = require('./usuarios');
const authRouter = require('./auth');
const gastosRouter = require('./gastos');
const gruposRouter = require('./grupos');
const categoriasRouter = require('./categorias');
const tagsRouter = require('./tags');

const express = require('express');

var app = express();

app.use('/auth', authRouter);
app.use('/categorias', categoriasRouter);
app.use('/gastos', gastosRouter);
app.use('/grupos', gruposRouter);
app.use('/tags', tagsRouter);
app.use('/usuarios', usuariosRouter);


module.exports = app;