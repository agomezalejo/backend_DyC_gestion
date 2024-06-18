const express = require('express');
const router = express.Router();
const Usuarios = require('../models').Usuario;
const env = process.env.RAILWAY_ENVIRONMENT_NAME || process.env.NODE_ENV || 'development';
const config = (env === 'development' || env === 'test') ? require(__dirname + '/../config/config.json')[env] : process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = config.SEED;


router.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;
  try {
      const objUsuario = await Usuarios.findOne({ where: { nombre_usuario: usuario } });
      if (!objUsuario) {
          return res.status(401).json({ok:false, message: 'Credenciales incorrectas' });
      }

      const contraseñaValida = await bcrypt.compare(contraseña, objUsuario.contraseña);
      if (!contraseñaValida) {
          return res.status(401).json({ ok:false, message: 'Credenciales incorrectas' });
      }

      const payload = {
        usuario:{
            id: objUsuario.id,
            usuario: objUsuario.nombre_usuario
        }
      };
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '7 days' });

      res.json({ ok:true, message: 'Inicio de sesión exitoso', token });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
  }
});
  

 module.exports = router;