const Grupo = require('../models').Grupo;
const Usuario = require('../models').Usuario;

const traer_integrantes_de_grupo = async (id_grupo) => {
  try {
    const grupo = await Grupo.findByPk(id_grupo, {
      include: [
        {
          model: Usuario,
          as: 'usuarios',
          attributes: ['id', 'nombre_usuario', 'nombre', 'apellido', 'email']
        }
      ]
    });

    return grupo.usuarios;
  } catch (error) {
    console.error('Error al obtener los integrantes del grupo:', error);
    throw new Error('Error al obtener los integrantes del grupo');
  }
};

module.exports = {
    traer_integrantes_de_grupo
} 