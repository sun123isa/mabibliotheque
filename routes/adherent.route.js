const express =  require('express');
const router = express.Router();

const {getAdherents, getAdherentById, createAdherent , updateAdherent
    , deleteAdherent
} = require('../controllers/adherent.controller');


router.get('/', getAdherents);
router.get('/:id', getAdherentById);
router.post('/', createAdherent);
router.put('/:id', updateAdherent);
router.delete('/:id', deleteAdherent);


module.exports = router;