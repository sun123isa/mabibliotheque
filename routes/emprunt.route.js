const express =  require('express');
const router = express.Router();

const {getEmprunts, getEmpruntById, createEmprunt, getEmpruntsEnCours, getEmpruntsEnRetard, retourEmprunt
} = require('../controllers/emprunt.controller');


// 1. Routes de lecture spécifiques (Toujours en premier)
router.get('/', getEmprunts);
router.get('/en-cours', getEmpruntsEnCours);  
router.get('/en-retard', getEmpruntsEnRetard);

// 2. Routes de lecture avec paramètres dynamiques
router.get('/:id', getEmpruntById);

// 3. Routes d'action et de modification
router.post('/', createEmprunt);
router.put('/:id/retour', retourEmprunt);





module.exports = router;