const express = require('express');
const router = express.Router();
const {
  getAllTags,
  getTagsByUserId,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  getTagsByGroupId,
} = require('../Controllers/tagsController');
const authenticateToken = require('../middlewares/verificarToken');


router.get('/',[authenticateToken] , getAllTags);

router.get('/mios',[authenticateToken] , getTagsByUserId);

router.get('/grupo/:idGrupo',[authenticateToken] , getTagsByGroupId);

router.get('/:id',[authenticateToken] , getTagById);

router.post('/',[authenticateToken] , createTag);

router.put('/:id',[authenticateToken] , updateTag);

router.delete('/:id',[authenticateToken] , deleteTag);

module.exports = router;
