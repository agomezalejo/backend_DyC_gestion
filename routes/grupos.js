const express = require('express');
const router = express.Router();
const {
  getAllGrupos,
  getGruposByUserId,
  getGrupoById,
  createGrupo,
  updateGrupo,
  deleteGrupo,
  addIntegranteByToken,
} = require('../Controllers/gruposController');
const authenticateToken = require('../middlewares/verificarToken');


router.get('/',[authenticateToken] , getAllGrupos);

router.get('/mios',[authenticateToken] , getGruposByUserId);

router.get('/:id',[authenticateToken] , getGrupoById);

router.post('/',[authenticateToken] , createGrupo);

router.post('/addIntegrante/:token',[authenticateToken] , addIntegranteByToken);

router.put('/:id',[authenticateToken] , updateGrupo);

router.delete('/:id',[authenticateToken] , deleteGrupo);

module.exports = router;
