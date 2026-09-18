const pool = require('../config/db.config')

class Livre{

    static async findAll({ page = 1, limit = 6 } = {}) {
        const offset = (page - 1) * limit;

        const result = await pool.query(
            `SELECT l.id,
                    l.titre,
                    l.auteur_id,
                    l.annee_publication,
                    l.statut,
                    a.nom AS auteur_nom
            FROM livres l
            JOIN auteurs a ON a.id = l.auteur_id
            ORDER BY l.id DESC
            LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        return result.rows;
    }

    static async count() {
        const result = await pool.query('SELECT COUNT(*)::int AS total FROM livres');
        return result.rows[0].total;
}

    static async findById(id){
        const result = await pool.query(
        'SELECT * FROM livres WHERE id = $1 ', [id]
        );
        return result.rows[0] || null;
    }

    static async create({titre , auteur_id, annee_publication}){
        const result = await pool.query(`INSERT INTO livres (titre , auteur_id ,annee_publication) 
            VALUES ($1, $2, $3) RETURNING *`,[titre, auteur_id, annee_publication]);
        return result.rows[0] || null;
    }

    static async update(id, { titre, auteur_id, annee_publication }){
        const result = await pool.query(`UPDATE livres SET titre = $1, auteur_id = $2, annee_publication = $3
                                         WHERE id = $4 RETURNING *`, [
                                            titre.trim(),
                                            auteur_id,
                                            annee_publication || null,
                                            id
                                        ]);
        return result.rows[0] || null;
    }


    static async delete(id) {
        const result = await pool.query( 'DELETE FROM livres WHERE id = $1 RETURNING *', [id] );
        return result.rows[0] || null;
    }


    // models/Livre.js

static async search(q) {
    // Si aucun terme → renvoyer un tableau vide
    if (!q || q.trim() === '') {
        return [];
    }

    const result = await pool.query(
        `SELECT l.id,
                l.titre,
                l.auteur_id,
                l.annee_publication,
                l.statut,
                a.nom AS auteur_nom
         FROM livres l
         JOIN auteurs a ON a.id = l.auteur_id
         WHERE l.titre LIKE $1
            OR a.nom   LIKE $1
         ORDER BY l.titre ASC`,
        [`%${q.trim()}%`]
    );

    return result.rows;
}



}


module.exports =  Livre;