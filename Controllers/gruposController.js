const Grupo = require('../models').Grupo;
const Usuario = require('../models').Usuario;
const GrupoUsuario = require('../models').GrupoUsuario;
const crypto = require('crypto');
const { minimizeDebts } = require('../helpers/division');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const getAllGrupos = async (req, res) => {
  try {
    const grupos = await Grupo.findAll();
    res.status(200).json(grupos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los grupos' });
  }
};

const getGruposByUserId = async (req, res) => {
  const idUsuario = req.usuario.id;
  try {
    const usuario = await Usuario.findByPk(idUsuario, {
      include: {
        model: Grupo,
        as: 'grupos',
        through: { attributes: [] }
      }
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json({grupos:usuario.grupos});
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los grupos del usuario' });
  }
};

const getGrupoById = async (req, res) => {
    const id = req.params.id;
    try {
      const grupo = await Grupo.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: 'usuarios',
            attributes: ['id', 'nombre_usuario', 'nombre', 'apellido', 'email']
          }
        ]
      });
  
      if (!grupo) {
        return res.status(404).json({ error: 'Grupo no encontrado' });
      }
  
      res.status(200).json(grupo);
    } catch (error) {
      console.error('Error al obtener el grupo:', error);
      res.status(500).json({ error: 'Error al obtener el grupo' });
    }
  };

const createGrupo = async (req, res) => {
    const idUsuario = req.usuario.id;
    const { nombre, descripcion, limite_gasto, monto_gastado, color, token } = req.body;
    try {
      let tk = token;
      if (!tk) {
        tk = crypto.randomBytes(20).toString('hex');
      }
      const grupo = await Grupo.create({ nombre, descripcion, limite_gasto, monto_gastado, color, token: tk});

      await GrupoUsuario.create({ id_grupo: grupo.id, id_usuario: idUsuario });

      res.status(201).json({ grupo });
    } catch (error) {
      console.error('Error al crear el grupo:', error);
      res.status(500).json({ error: 'Error al crear el grupo' });
    }
  };

  const postSaldarDeuda = async (req, res) => {
    const { id } = req.params;
    try {
      const grupoUsuarios = await GrupoUsuario.findAll({
        where: { id_grupo:id },
        include: [{ model: Usuario, as: 'usuario', attributes: ['nombre_usuario'] }]
      });

      if (!grupoUsuarios.length) {
        return res.status(404).json({ message: 'Grupo no encontrado o sin usuarios.' });
      }

      let balances = grupoUsuarios.map(gu => ({
        id: gu.id,
        id_usuario: gu.id_usuario,
        nombre_usuario: gu.usuario.nombre_usuario, // Ajustar el acceso al alias correcto
        balance: parseFloat(gu.balance)
      }));

      const transactions = minimizeDebts(balances);

      for (let gu of grupoUsuarios) {
        await gu.update({ balance: 0 });
      }

      res.json({transacciones:transactions});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
};


const updateGrupo = async (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion, limite_gasto, monto_gastado, color } = req.body;
  try {
    const grupo = await Grupo.findByPk(id);
    if (!grupo) {
      return res.status(404).json({ error: 'Grupo no encontrado' });
    }
    grupo.nombre = nombre;
    grupo.descripcion = descripcion;
    grupo.limite_gasto = limite_gasto;
    grupo.monto_gastado = monto_gastado;
    grupo.color = color;
    await grupo.save();
    res.status(200).json(grupo);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el grupo' });
  }
};

const addIntegranteByToken = async (req, res) => {
    const { token } = req.params;
    const idUsuario = req.usuario.id;
    const { ids_usuarios } = req.body;
    
    try {
      const grupo = await Grupo.findOne({ where: { token } });
      if (!grupo) {
        return res.status(404).json({ error: 'Grupo no encontrado' });
      }
      if(ids_usuarios && ids_usuarios.length > 0){
        for (const idUsuario of ids_usuarios) {
            const usuario = await Usuario.findByPk(idUsuario);
            if (!usuario) {
              return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            
            const existeRelacion = await GrupoUsuario.findOne({ where: { id_grupo: grupo.id, id_usuario: idUsuario } });
            if (existeRelacion) {
              continue;
            }
            await GrupoUsuario.create({ id_grupo: grupo.id, id_usuario: idUsuario });
        }
      }else{
        const existeRelacion = await GrupoUsuario.findOne({ where: { id_grupo: grupo.id, id_usuario: idUsuario } });
        if (existeRelacion) {
          return res.status(400).json({ error: 'El usuario ya pertenece al grupo' });
        }
        await GrupoUsuario.create({ id_grupo: grupo.id, id_usuario: idUsuario });
      }
  
      
      res.status(200).json({ message: 'Usuario agregado al grupo correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el usuario al grupo' });
    }
  };

  const removeIntegranteByIdGrupo = async (req, res) => {
    const { idGrupo } = req.params;
    const idUsuario = req.usuario.id;
    
    try {
        const grupo = await Grupo.findByPk(idGrupo);
        if (!grupo) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }

        const relacion = await GrupoUsuario.findOne({ where: { id_grupo: idGrupo, id_usuario: idUsuario } });
        if (!relacion) {
            return res.status(404).json({ error: 'Usuario no pertenece al grupo' });
        }

        const balanceUsuario = relacion.balance;

        const otrosIntegrantes = await GrupoUsuario.findAll({ 
            where: { id_grupo: idGrupo, id_usuario: { [Op.ne]: idUsuario } } 
        });

        if (otrosIntegrantes.length > 0) {
            const balanceRedistribuido = balanceUsuario / otrosIntegrantes.length;

            for (const integrante of otrosIntegrantes) {
                integrante.balance = parseFloat(integrante.balance) + balanceRedistribuido;
                if(Math.abs(integrante.balance) < 0.01){
                    integrante.balance = 0;
                }
                await integrante.save();
            }
        }

        await GrupoUsuario.destroy({ where: { id_grupo: idGrupo, id_usuario: idUsuario } });

        res.status(200).json({ message: 'Usuario removido del grupo y balance redistribuido correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al remover el usuario del grupo' });
    }
};

const deleteGrupo = async (req, res) => {
    const { id } = req.params;
    try {
      // Buscar el grupo por su ID
      const grupo = await Grupo.findByPk(id);
      if (!grupo) {
        return res.status(404).json({ error: 'Grupo no encontrado' });
      }
  
      // Eliminar todas las relaciones de los usuarios con el grupo
      await GrupoUsuario.destroy({ where: { id_grupo: id } });
  
      // Eliminar el grupo
      await grupo.destroy();
  
      res.status(200).json({ message: 'Grupo eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el grupo:', error);
      res.status(500).json({ error: 'Error al eliminar el grupo' });
    }
  };

module.exports = {
  getAllGrupos,
  getGruposByUserId,
  getGrupoById,
  createGrupo,
  postSaldarDeuda,
  addIntegranteByToken,
  removeIntegranteByIdGrupo,
  updateGrupo,
  deleteGrupo,
};
