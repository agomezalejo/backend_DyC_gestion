const express = require('express');
const router = express.Router();
const Categoria = require('../models').Categoria;
const authenticateToken = require('../middlewares/verificarToken');


router.get('/',[authenticateToken] , async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Categoria.findAndCountAll({
      limit: limit,
      offset: offset
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      totalItems: count,
      totalPages: totalPages,
      currentPage: page,
      categorias: rows
    });
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:id',[authenticateToken] , async (req, res) => {
  const id = req.params.id;

  try {
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.status(200).json(categoria);
  } catch (error) {
    console.error('Error al obtener la categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/',[authenticateToken] , async (req, res) => {
  const { nombre, descripcion, color } = req.body;

  try {
    const nuevaCategoria = await Categoria.create({
      nombre,
      descripcion,
      color
    });

    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:id',[authenticateToken] , async (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion, color } = req.body;

  try {
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    categoria.nombre = nombre;
    categoria.descripcion = descripcion;
    categoria.color = color;

    await categoria.save();

    res.status(200).json(categoria);
  } catch (error) {
    console.error('Error al actualizar la categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:id',[authenticateToken] , async (req, res) => {
  const id = req.params.id;

  try {
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    await categoria.destroy();

    res.status(200).json({ message: 'Categoría eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
