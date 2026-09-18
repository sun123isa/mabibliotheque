const Adherent = require('../models/adherent.model')


const getAdherents = async (req, res)=>{
    try {
        const adherents = await Adherent.findAll();
        return res.status(200).json(adherents);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de recuperer les adherents'
        });
    }
}
const getAdherentById = async (req, res)=>{
    try {
        const id = req.params.id
        const adherent = await Adherent.findById(id);
        return res.status(200).json(adherent);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de recuperer le adherent'
        });
    }
}

const createAdherent = async (req, res)=>{
    try {
        const { nom, contact}  = req.body;
        const adherent = await Adherent.create({nom, contact});
        return res.status(200).json(adherent);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de creer le adherent '+error.message
        });
    }
}

const deleteAdherent = async (req, res)=>{
     try {
        const id = req.params.id
        const adherent = await Adherent.delete(id);
        return res.status(200).json(adherent);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de modifier l\'adherent '+error.message
        });
    }
}


const updateAdherent = async (req, res)=>{
    try {
        const id = req.params.id
        const { nom, contact}  = req.body;
        const livre = await Adherent.update(id, {nom, contact});
        return res.status(200).json(livre);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de modifier adherent '+error.message
        });
    }
}



module.exports = {
    getAdherents,
    getAdherentById,
    createAdherent,
    deleteAdherent,
    updateAdherent
}