const express = require('express');
const router = express.Router();
const Usuario = require('../models').usuario;
const bcrypt = require('bcrypt');


router.post('/', async (req, res) => {
    const { usuario, contraseña } = req.body;
    try {
      const objUsuario = await Usuario.findOne({ where: { nombre_usuario:usuario } });
      if (!objUsuario) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }
  
      const contraseñaValida = await bcrypt.compare(contraseña, objUsuario.contraseña);
      if (!contraseñaValida) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }
  
      res.json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });
  

 module.exports = router;