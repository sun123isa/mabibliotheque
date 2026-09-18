const express =  require('express');
const router = express.Router();

const {getAuteurs, getAuteurById, createAuteur , updateAuteur
    , deleteAuteur
} = require('../controllers/auteur.controller');


router.get('/', getAuteurs);
router.get('/:id', getAuteurById);
router.post('/', createAuteur);
router.put('/:id', updateAuteur);
router.delete('/:id', deleteAuteur);




module.exports = router;