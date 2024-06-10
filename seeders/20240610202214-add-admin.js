// userSeeder.js
const bcrypt = require('bcrypt');
const User = require('../models/user');

async function seedUsers() {
  try {
    const hashedPassword = await bcrypt.hash('qatar22', 10); // Cambia 'contraseña1' por la contraseña deseada

    await User.bulkCreate([
      { 
        nombre_usuario: 'lmessi',
        nombre: 'Lionel', 
        apellido: 'Messi', 
        email: 'campeondelmundo22@mail.com', 
        contraseña: hashedPassword 
      },
    ]);
    console.log('Usuarios insertados correctamente.');
  } catch (error) {
    console.error('Error al insertar usuarios:', error);
  }
}

module.exports = seedUsers;
