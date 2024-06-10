const Gastos = require("../models").Gasto;
const Usuarios = require("../models").Usuario;
const sequelize = require('sequelize');
const Op = sequelize.Op;
const Categorias = require("../models").Categoria;
const GastoFijo = require("../models").GastoFijo;
const Tags = require("../models").Tag;
const GrupoUsuario = require("../models").GrupoUsuario;
const Grupos = require("../models").Grupo;
const GastoUsuario = require("../models").GastoUsuario;
const moment = require('moment');
const { crear_gasto_y_fijo, tranformar_frecuencia, 
  calcular_proximos_fijos, calulos_y_validaciones, crear_proximos_fijos, 
  crear_gasto_casual} = require("../helpers/gastosHelper");



const getGastosGrupo = async (req, res) => {
    const idGrupo = req.params.idGrupo;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
  
    const inicio = req.query.inicio ? moment(req.query.inicio).startOf('day') : moment().startOf('month');
    const fin = req.query.fin ? moment(req.query.fin).endOf('day') : moment().endOf('month');
  
    try {
      const { count, rows } = await Gastos.findAndCountAll({
        include: [
          {
            model: Grupos,
            as: 'grupo',
            where: { id: idGrupo },
            attributes: []
          },
          {
            model: Categorias,
            as: 'categoria',
            attributes: ['nombre']
          },
          {
            model: GastoFijo,
            as: 'gastoFijo',
            required: false 
          },
          {
            model: Tags,
            as: 'tags',
            attributes: ['nombre']
          },
          {
            model: GastoUsuario, 
            as: 'participantes', 
            include: [
              {
                model: Usuarios, 
                as: 'usuarios', 
                attributes: ['id', 'nombre_usuario', 'nombre', 'apellido', 'email'] 
              }
            ]
          }
        ],
        where: {
          fecha: {
            [Op.between]: [inicio.toDate(), fin.toDate()]
          }
        },
        limit: limit,
        offset: offset
      });
  
      const totalPages = Math.ceil(count / limit);
  
      res.status(200).json({
        totalItems: count,
        totalPages: totalPages,
        currentPage: page,
        gastos: rows
      });
    } catch (error) {
      console.error('Error al obtener los gastos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
};




module.exports = {

    getGastosGrupo

};