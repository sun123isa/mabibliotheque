const express =  require('express');
const router = express.Router();

const {getLivres, getLivreById, createLivre , updateLivre
    , deleteLivre, searchLivres
} = require('../controllers/livre.controller');


router.get('/search', searchLivres); 
router.get('/', getLivres);
router.get('/:id', getLivreById);
router.post('/', createLivre);
router.put('/:id', updateLivre);
router.delete('/:id', deleteLivre);




module.exports = router;