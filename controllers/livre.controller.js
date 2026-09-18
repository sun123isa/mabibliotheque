const Livre = require('../models/livre.model')


const getLivres = async (req, res) => {
    try {
        const page  = parseInt(req.query.page, 10)  || 1;
        const limit = parseInt(req.query.limit, 10) || 6;

        const livres = await Livre.findAll({ page, limit });
        const total  = await Livre.count();

        return res.status(200).json({
            data: livres,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Impossible de récupérer les livres : ' + error.message
        });
    }
};




const getLivreById = async (req, res)=>{
    try {
        const id = req.params.id
        const livre = await Livre.findById(id);
        return res.status(200).json(livre);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de recuperer le livre'
        });
    }
}

const createLivre = async (req, res)=>{
    try {
        const { titre, auteur_id, annee_publication}  = req.body;
        const livre = await Livre.create({titre, auteur_id,annee_publication});
        return res.status(200).json(livre);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de creer le livre '+error.message
        });
    }
}

const deleteLivre = async (req, res)=>{
     try {
        const id = req.params.id
        const livre = await Livre.delete(id);
        return res.status(200).json(livre);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de modifier le livre '+error.message
        });
    }
}


const updateLivre = async (req, res)=>{
    try {
        const id = req.params.id
        const { titre, auteur_id, annee_publication}  = req.body;
        const livre = await Livre.update(id, {titre, auteur_id,annee_publication});
        return res.status(200).json(livre);
    } catch (error) {
         res.status(500).json({
            message: 'Impossible de modifier le livre '+error.message
        });
    }
}


const searchLivres = async (req, res) => {
    try {
        const { q } = req.query;
        const livres = await Livre.search(q);
        return res.status(200).json(livres);
    } catch (error) {
        res.status(500).json({
            message: 'Impossible de rechercher les livres ' + error.message
        });
    }
};



module.exports = {
    getLivres,
    getLivreById,
    createLivre,
    deleteLivre,
    updateLivre,  
    searchLivres
}