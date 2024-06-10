const GrupoUsuario = require('../models').GrupoUsuario;
const Usuario = require('../models').Usuario;

const traer_integrantes_de_grupo = async (id_grupo) => {
  try {
    const integrantes = await GrupoUsuario.findAll({
      where: { id_grupo },
      include: [{
        model: Usuario,
        as: 'usuario', 
        attributes: ['id', 'nombre', 'apellido', 'email'] 
      }]
    });

    return integrantes;
  } catch (error) {
    console.error('Error al obtener los integrantes del grupo:', error);
    throw new Error('Error al obtener los integrantes del grupo');
  }
};

module.exports = {
    traer_integrantes_de_grupo
} 