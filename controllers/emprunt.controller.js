const Emprunt = require('../models/emprunt.model')


const getEmprunts = async (req, res)=>{
    try {
        const emprunts = await Emprunt.findAll();
        return res.status(200).json(emprunts);
    } catch (error) {
          res.status(500).json({
            message: 'Impossible de recuperer les emprunts'
        });
    }
}
const getEmpruntById = async (req, res)=>{
    try {
        const id = req.params.id
        const emprunt = await Emprunt.findById(id);
        return res.status(200).json(emprunt);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de recuperer cet emprunt'
        });
    }
}

const createEmprunt = async (req, res, next)=>{
    try {
        const {
        adherent_id,
        livre_id,
        date_retour_prevue
        } = req.body;

        if (!adherent_id) {
        return res.status(400).json({
            message: 'L’adhérent est obligatoire'
        });
        }

        if (!livre_id) {
        return res.status(400).json({
            message: 'Le livre est obligatoire'
        });
        }

        if (!date_retour_prevue) {
        return res.status(400).json({
            message: 'La date de retour prévue est obligatoire'
        });
        }


        const emprunt = await Emprunt.create({adherent_id, livre_id,date_retour_prevue});
        return res.status(200).json(emprunt);
    } catch (error) {
        next(error); 
    }
}


const getEmpruntsEnCours = async (req, res)=>{
    try {
        const emprunts = await Emprunt.findAllEnCours();
        return res.status(200).json(emprunts);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de recuperer les emprunts en cours'
        });
    }
}

const getEmpruntsEnRetard = async (req, res)=>{
    try {
        const emprunts = await Emprunt.findAllEnRetard();
        return res.status(200).json(emprunts);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de recuperer cet emprunt'
        });
    }
}

const retourEmprunt = async (req, res)=>{
    try {
        const id = req.params.id
        const emprunt = await Emprunt.faireRetourEmprunt(id);
        return res.status(200).json(emprunt);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de recuperer cet emprunt'+error.message
        });
    }
}





module.exports = {
    getEmprunts,
    getEmpruntById,
    createEmprunt,
    getEmpruntsEnCours,
    getEmpruntsEnRetard, 
    retourEmprunt

}