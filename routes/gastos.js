const express = require("express");
const router = express.Router();
const Gastos = require("../models").gasto;
const Usuarios = require("../models").usuario;

router.get("/:id_usuario", async (req, res) => {
  const idUsuario = req.params.id_usuario;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const offset = (page - 1) * limit;

  try {
    const usuario = await Usuarios.findByPk(idUsuario);
    if (!usuario) {
      res.status(400).json({
        error: `No se encontro el usuario con el id: ${idUsuario}`,
      });
      return;
    }

    const gastos = await usuario.getGastos({
      offset: offset,
      limit: tamanoPagina,
      include: [
        {
          model: Usuarios,
          as: "Usuarios",
          attributes: [],
          through: {
            attributes: [],
          },
        },
      ],
    });

    const count = await gastos.length;
    const totalPages = Math.ceil(count / limit);

    res.json({
      totalGastos: count,
      totalPages,
      currentPage: page,
      gastos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const gasto = await Gastos.findByPk(id);
    if (gasto) {
      res.json(gasto);
    } else {
      res.status(404).json({ message: "Gasto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.post("/", async (req, res) => {
  const {
    id,
    nombre,
    monto,
    fecha,
    categoria,
    tipo,
    metodo_pago,
    nota,
    etiquetas,
    liquidacion,
  } = req.body;
  try {

    const usuario = await Usuarios.findByPk(id);
    if (!usuario) {
      res.status(400).json({
        error: `No se encontro el usuario con el id: ${id}`,
      });
      return;
    }

    const nuevoGasto = await Usuarios.create({
      nombre,
      monto,
      fecha,
      categoria,
      tipo,
      metodo_pago,
      nota,
      etiquetas,
      liquidacion,
    });
    await usuario.addGastos(gasto);

    res.status(201).json(nuevoGasto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    monto,
    fecha,
    categoria,
    tipo,
    metodo_pago,
    nota,
    etiquetas,
    liquidacion,
  } = req.body;
  try {
    const gastoEncontrado = await Gastos.findByPk(id);
    if (gastoEncontrado) {
      const camposActualizados = {};

      if (nombre !== undefined) camposActualizados.nombre = nombre;
      if (monto !== undefined) camposActualizados.monto = monto;
      if (fecha !== undefined) camposActualizados.fecha = fecha;
      if (categoria !== undefined) camposActualizados.categoria = categoria;
      if (tipo !== undefined) camposActualizados.tipo = tipo;
      if (metodo_pago !== undefined) camposActualizados.metodo_pago = metodo_pago;
      if (nota !== undefined) camposActualizados.nota = nota;
      if (etiquetas !== undefined) camposActualizados.etiquetas = etiquetas;
      if (liquidacion !== undefined) camposActualizados.liquidacion = liquidacion;

      await gastoEncontrado.update(camposActualizados);

      res.json(gastoEncontrado);
    } else {
      res.status(404).json({ message: "Gasto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const gasto = await Gastos.findByPk(id);
      if (gasto) {
        await gasto.destroy();
        res.json({ message: 'Gasto eliminado exitosamente' });
      } else {
        res.status(404).json({ message: 'Gasto no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });

module.exports = router;
