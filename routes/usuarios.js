const express = require('express');
const router = express.Router();
const Usuarios = require('../models').usuario;
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 20; 
  
    const offset = (page - 1) * limit;
  
    try {
      const usuarios = await Usuarios.findAll({
        offset,
        limit
      });
  
      const count = await Usuarios.count();
      const totalPages = Math.ceil(count / limit);
  
      res.json({
        totalUsuarios: count,
        totalPages,
        currentPage: page,
        usuarios
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuarios.findByPk(id);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  const { usuario, nombre, apellido, email, contraseña } = req.body;
  try {
    const hashContraseña = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = await Usuarios.create({ nombre_usuario:usuario, nombre, apellido, email, contraseña:hashContraseña });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { usuario, nombre, apellido, email, contraseña } = req.body;
    try {
      const usuarioEncontrado = await Usuarios.findByPk(id);
      if (usuarioEncontrado) {
        const camposActualizados = {};
  
        if (usuario !== undefined) camposActualizados.usuario = usuario;
        if (nombre !== undefined) camposActualizados.nombre = nombre;
        if (apellido !== undefined) camposActualizados.apellido = apellido;
        if (email !== undefined) camposActualizados.email = email;
        if (contraseña !== undefined) camposActualizados.contraseña = await bcrypt.hash(contraseña, 10);
  
        await usuarioEncontrado.update(camposActualizados);
  
        res.json(usuarioEncontrado);
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuarios.findByPk(id);
    if (usuario) {
      await usuario.destroy();
      res.json({ message: 'Usuario eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
