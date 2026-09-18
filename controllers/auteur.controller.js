const Auteur = require('../models/auteur.model')


const getAuteurs = async (req, res)=>{
    try {
        const auteurs = await Auteur.findAll();
        return res.status(200).json(auteurs);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de recuperer les auteurs'
        });
    }
}
const getAuteurById = async (req, res)=>{
    try {
        const id = req.params.id
        const auteur = await Auteur.findById(id);
        return res.status(200).json(auteur);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de recuperer le auteur'
        });
    }
}

const createAuteur = async (req, res)=>{
    try {
        const { nom, nationalite}  = req.body;
        const auteur = await Auteur.create({nom, nationalite});
        return res.status(200).json(auteur);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de creer cet auteur '+error.message
        });
    }
}

const deleteAuteur = async (req, res)=>{
     try {
        const id = req.params.id
        const auteur = await Auteur.delete(id);
        return res.status(200).json(auteur);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de modifier cet auteur :   '+error.message
        });
    }
}


const updateAuteur = async (req, res)=>{
    try {
        const id = req.params.id
        const { nom , nationalite}  = req.body;
        const auteur = await Auteur.update(id,{nom, nationalite});
        return res.status(200).json(auteur);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de modifier cet auteur :   '+error.message
        });
    }
}



module.exports = {
    getAuteurs,
    getAuteurById,
    createAuteur,
    deleteAuteur,
    updateAuteur
}