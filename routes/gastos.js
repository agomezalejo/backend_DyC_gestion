const express = require("express");
const authenticateToken = require("../middlewares/verificarToken");
const router = express.Router();
const Gastos = require("../models").Gasto;
const { post_gasto_casual, post_gasto_fijo, 
  getGastosPropios, getGastosPropiosGrupos, getGastosGrupo, 
  post_gasto_fijo_grupo,
  post_gasto_casual_grupo} = require("../Controllers/gastosController");

router.get('/propios', [authenticateToken], getGastosPropios);

router.get("/perfil/grupos",[authenticateToken] , getGastosPropiosGrupos);

router.get("/grupo/:idGrupo",[authenticateToken] , getGastosGrupo)

router.get("/:id",[authenticateToken] , async (req, res) => {
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

router.post('/casual',[authenticateToken] , post_gasto_casual);

router.post('/fijo',[authenticateToken] , post_gasto_fijo);

router.post('/casual/grupo/:idGrupo',[authenticateToken] , post_gasto_casual_grupo);

router.post('/fijo/grupo/:idGrupo',[authenticateToken] , post_gasto_fijo_grupo);

router.put("/:id",[authenticateToken] , async (req, res) => {
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

router.delete('/:id',[authenticateToken] ,async (req, res) => {
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
