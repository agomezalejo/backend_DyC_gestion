const Tag = require('../models').Tag;
const Usuario = require('../models').Usuario;
const Grupo = require('../models').Grupo;

const getAllTags = async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los tags' });
  }
};

const getTagsByUserId = async (req, res) => {
  const idUsuario = req.usuario.id;
  try {
    const tags = await Tag.findAll({ where: { id_usuario: idUsuario } });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los tags por usuario' });
  }
};

const getTagsByGroupId = async (req, res) => {
    const idGrupo = req.params.idGrupo;
    try {
      const tags = await Tag.findAll({ where: { id_grupo: idGrupo } });
      res.status(200).json(tags);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los tags por usuario' });
    }
  };

const getTagById = async (req, res) => {
  const id = req.params.id;
  try {
    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag no encontrado' });
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el tag' });
  }
};

const createTag = async (req, res) => {
  const { nombre, descripcion, color, id_grupo } = req.body;
  const id_usuario = req.usuario.id;
  try {
    
    let constructor_tag = { nombre, descripcion, color }

    if (id_grupo) {
      const grupo = await Grupo.findByPk(id_grupo);
      if (!grupo) {
        return res.status(404).json({ error: 'Grupo no encontrado' });
      }
      constructor_tag.id_grupo = id_grupo;
    }else{
      constructor_tag.id_usuario = id_usuario;
    }

    const tag = await Tag.create(constructor_tag);
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el tag' });
  }
};

const updateTag = async (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion, color } = req.body;
  try {
    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag no encontrado' });
    }
    tag.nombre = nombre;
    tag.descripcion = descripcion;
    tag.color = color;
    await tag.save();
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el tag' });
  }
};

const deleteTag = async (req, res) => {
  const id = req.params.id;
  try {
    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag no encontrado' });
    }
    await tag.destroy();
    res.status(200).json({ message: 'Tag eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el tag' });
  }
};

module.exports = {
  getAllTags,
  getTagsByUserId,
  getTagsByGroupId,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
};
