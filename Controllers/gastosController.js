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
  crear_gasto_casual,
  mergear_integrantes} = require("../helpers/gastosHelper");

const getGastosPropios = async (req, res) => {
    const idUsuario = req.usuario.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
  
    const inicio = req.query.inicio ? moment(req.query.inicio).startOf('day') : moment().startOf('month');
    const fin = req.query.fin ? moment(req.query.fin).endOf('day') : moment().endOf('month');
  
    try {
      const { count, rows } = await Gastos.findAndCountAll({
        include: [
          {
            model: Usuarios,
            as: 'usuarios',
            where: { id: idUsuario },
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
            required: false // Esto asegura que se incluyan los gastos que no tienen una relación con GastoFijo
          },
          {
            model: Tags,
            as: 'tags',
            attributes: ['nombre']
          }
        ],
        where: {
          fecha: {
            [Op.between]: [inicio.toDate(), fin.toDate()]
          },
          id_grupo: null 
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


const getGastosPropiosGrupos = async (req, res) => {
  const idUsuario = req.usuario.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  try {
    // Obtener los grupos a los que pertenece el usuario
    const grupos = await Grupos.findAll({
      include: [
        {
          model: Usuarios,
          as: 'usuarios',
          where: { id: idUsuario },
          through: { attributes: [] }
        }
      ],
      attributes: ['id']
    });

    const grupoIds = grupos.map(grupo => grupo.id);

    // Obtener los gastos de esos grupos
    const gastos = await Gastos.findAll({
      where: {
        [Op.and]: [
          { id_grupo: grupoIds },
          {
            [Op.or]: [
              {
                id: {
                  [Op.in]: sequelize.literal(`(
                    SELECT "id_gasto"
                    FROM "gastos_usuarios"
                    WHERE "id_usuario" = ${idUsuario}
                  )`)
                }
              },
              { liquidacion: 'PENDIENTE' }
            ]
          }
        ]
      },
      include: [
        {
          model: Grupos,
          as: 'grupo'
        },
        {
          model: Usuarios,
          as: 'usuarios',
          through: { attributes: [] },
          where: { id: idUsuario },
          required: false
        }
      ],
      limit: limit,
      offset: offset
    });

    res.status(200).json({
      currentPage: page,
      gastos
    });
  } catch (error) {
    console.error('Error al obtener los gastos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


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
            model: Usuarios, 
            as: 'usuarios', 
            through: {
              model: GastoUsuario,
              as: 'gastos_usuarios'
            }
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

const post_gasto_casual = async (req, res) => {
    const { 
        nombre, descripcion, monto, fecha, id_categoria, tags,  //generales
        monto_pagado, metodo_pago, // para 1 solo usuario
        saldado
    } = req.body;
    const usuarioActual = req.usuario;
    try {
        let monto_pago = saldado ? monto : 0;
        let usuarios_gastos = [{ id: usuarioActual.id, monto_pagado: monto_pago, metodo_pago: 'EFECTIVO' }];

        let Objresp = await calulos_y_validaciones(monto, usuarios_gastos, fecha, id_categoria, tags);
        if(!Objresp.ok){
          res.status(400).json({ error: Objresp.mensaje });
          return
        }
        let {pagado, liquidacion, fechaDate, tagsValidated} = Objresp;

        let constructor_gasto = {
          nombre,
          descripcion,
          monto,
          monto_pagado: pagado,
          tipo: 'CASUAL',
          liquidacion,
          fecha:fechaDate,
          id_categoria
        }

        let nuevoGasto = await crear_gasto_casual(constructor_gasto, tagsValidated, usuarios_gastos)
    
        res.status(201).json({mensaje: "Gasto creado correctamente", gasto:nuevoGasto});
    } catch (error) {
        console.error('Error al crear el gasto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const post_gasto_fijo = async (req, res) => {
    const { 
        nombre, descripcion, monto, fecha, id_categoria, tags,  //generales
        monto_pagado, metodo_pago, // para 1 solo usuario
        frecuencia, // para fijos
        saldado
    } = req.body;
    const usuarioActual = req.usuario;

    try {
        let monto_pago = saldado ? monto : 0;
        let usuarios_gastos = [{ id: usuarioActual.id, monto_pagado: monto_pago, metodo_pago: 'EFECTIVO' }];

        let Objresp = await calulos_y_validaciones(monto, usuarios_gastos, fecha, id_categoria, tags);
        if(!Objresp.ok){
          res.status(400).json({ error: Objresp.mensaje });
          return
        }
        let {pagado, liquidacion, fechaDate, tagsValidated} = Objresp;
        let {unit_time, frecuencia_transformada} = tranformar_frecuencia(frecuencia);

        let proxima_fecha = moment(fechaDate).clone().add(1, unit_time).toDate();

        let constructor_gasto = {   
                                    nombre, descripcion, monto, monto_pagado: pagado,
                                    tipo:'FIJO', liquidacion, fecha:fechaDate, id_categoria 
                                }

        let constructor_fijo = { frecuencia:frecuencia_transformada, proxima_fecha }

        let {fijo, nuevoGasto} = await crear_gasto_y_fijo(constructor_gasto, tagsValidated, constructor_fijo, usuarios_gastos)
        let fechas_para_crear = calcular_proximos_fijos(proxima_fecha, unit_time)
        
        usuarios_gastos[0].monto_pagado = 0;
        usuarios_gastos[0].metodo_pago = null;

        await crear_proximos_fijos(constructor_gasto, tagsValidated, fechas_para_crear, constructor_fijo, fijo, unit_time, usuarios_gastos)
    
        res.status(201).json({mensaje: "Gasto creado correctamente", gasto:nuevoGasto});
    } catch (error) {
        console.error('Error al crear el gasto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
    
}

const post_gasto_casual_grupo = async (req, res) => {
  const id_grupo = req.params.idGrupo; 
  const { 
      nombre, descripcion, monto, fecha, id_categoria, tags,  //generales
      usuarios, // para grupos 
      saldado
    } = req.body;
  const usuarioActual = req.usuario;
  try {
      let monto_pagado = saldado ? monto : 0;
      if(!id_grupo){
        res.status(400).json({ error: 'No se ha proporcionado un grupo' });
        return
      }
      let usuariosV = []
      if(usuarios && usuarios.length > 0){
        usuariosV = [...usuarios];
      }else{
        if(saldado){
          usuariosV = [{ id: usuarioActual.id, monto_pagado: monto_pagado, metodo_pago: 'EFECTIVO' }]
        }
      }
      let Objresp =await calulos_y_validaciones(monto, usuariosV, fecha, id_categoria, tags, id_grupo);
      if(!Objresp.ok){
        res.status(400).json({ error: Objresp.mensaje });
        return
      }
      let {pagado, liquidacion, fechaDate, tagsValidated, integrantes} = Objresp;

      let constructor_gasto = {
        nombre,
        descripcion,
        monto,
        monto_pagado: pagado,
        tipo: 'CASUAL',
        liquidacion,
        fecha:fechaDate,
        id_categoria,
        id_grupo
      }

      let nuevoGasto = await crear_gasto_casual(constructor_gasto, tagsValidated, usuariosV, integrantes)
  
      res.status(201).json({mensaje: "Gasto creado correctamente", gasto:nuevoGasto});
  } catch (error) {
      console.error('Error al crear el gasto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
}

const post_gasto_fijo_grupo = async (req, res) => {
  const id_grupo = req.params.idGrupo;
  const { 
      nombre, descripcion, monto, fecha, id_categoria, tags,  //generales
      frecuencia, // para fijos
      usuarios, // para grupos 
      saldado
    } = req.body;
  const usuarioActual = req.usuario;
  try {
      let monto_pagado = saldado ? monto : 0;
      if(!id_grupo){
        res.status(400).json({ error: 'No se ha proporcionado un grupo' });
        return
      }

      let usuariosV = []
      if(usuarios && usuarios.length > 0){
        usuariosV = [...usuarios];
      }else{
        if(saldado){
          usuariosV = [{ id: usuarioActual.id, monto_pagado: monto_pagado, metodo_pago: 'EFECTIVO' }]
        }
      }

      let Objresp = await calulos_y_validaciones(monto, usuariosV, fecha, id_categoria, tags, id_grupo);
      if(!Objresp.ok){
          res.status(400).json({ error: Objresp.mensaje });
          return
      }

      let {pagado, liquidacion, fechaDate, tagsValidated, integrantes} = Objresp;
      let {unit_time, frecuencia_transformada} = tranformar_frecuencia(frecuencia);

      let proxima_fecha = moment(fechaDate).clone().add(1, unit_time).toDate();

      let constructor_gasto = {   
                                  nombre, descripcion, monto, monto_pagado: pagado,
                                  tipo:'FIJO', liquidacion, fecha:fechaDate, id_categoria, id_grupo
                              }

      let constructor_fijo = { frecuencia:frecuencia_transformada, proxima_fecha }

      let {fijo, nuevoGasto} = await crear_gasto_y_fijo(constructor_gasto, tagsValidated, constructor_fijo, usuariosV, integrantes)
      let fechas_para_crear = calcular_proximos_fijos(proxima_fecha, unit_time)

      await crear_proximos_fijos(constructor_gasto, tagsValidated, fechas_para_crear, constructor_fijo, fijo, unit_time, [])

      res.status(201).json({mensaje: "Gasto creado correctamente", gasto:nuevoGasto});
  } catch (error) {
      console.error('Error al crear el gasto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
  
}

const postPagarGasto = async (req, res) => {
    const idGasto = req.params.id;
    const usuarioActual = req.usuario;
  
    try {
      const gasto = await Gastos.findByPk(idGasto);
  
      if (!gasto) {
        return res.status(404).json({ error: 'Gasto no encontrado' });
      }

      gasto.liquidacion = 'PAGADO';
      gasto.monto_pagado = gasto.monto;
      await gasto.save();
  
      await GastoUsuario.create({
          id_gasto: idGasto,
          id_usuario: usuarioActual.id,
          monto_pagado: gasto.monto,
          metodo_pago:  'EFECTIVO'
      });
      if(gasto.id_grupo){
          let usuarios = [{ id: usuarioActual.id, monto_pagado: gasto.monto, metodo_pago: 'EFECTIVO' }]; 
          let integrantes = await mergear_integrantes(usuarios, gasto.id_grupo);
          let gasto_por_persona = gasto.monto / integrantes.length;
          for (const integrante of integrantes) {
              let grupo_usuario = await GrupoUsuario.findOne({
                  where:{
                      id_grupo: gasto.id_grupo,
                      id_usuario: integrante.id
                  }
              });
              if(!grupo_usuario){
                  continue;
              }
              let nuevo_balance = (parseFloat(grupo_usuario.balance) + parseFloat(integrante.monto_pagado) - gasto_por_persona).toFixed(2);
              grupo_usuario.balance = nuevo_balance;
              await grupo_usuario.save();
          }
      }
  
      res.status(200).json({ mensaje: 'Gasto pagado correctamente' });
    } catch (error) {
      console.error('Error al pagar el gasto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
}


module.exports = {
    getGastosPropios,
    getGastosPropiosGrupos,
    getGastosGrupo,
    postPagarGasto,
    post_gasto_casual,
    post_gasto_fijo,
    post_gasto_fijo_grupo,
    post_gasto_casual_grupo
};