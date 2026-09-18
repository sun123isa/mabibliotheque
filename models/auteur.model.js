const pool = require('../config/db.config')

class Auteur{

    static async findAll(){
        const result = await pool.query(
        'SELECT * FROM auteurs'
        );
        return result.rows || null;
    }

    static async findById(id){
        const result = await pool.query(
        'SELECT * FROM auteurs WHERE id = $1 ', [id]
        );
        return result.rows[0] || null;
    }

    static async create({nom , nationalite}){
        const result = await pool.query(`INSERT INTO auteurs (nom, nationalite)
                                            VALUES ($1, $2)  RETURNING *`,
                                        [nom.trim().toLowerCase(), nationalite.trim().toLowerCase() || null]);
        return result.rows[0] || null;
    }

    static async update(id, {nom , nationalite}){
        const result = await pool.query(`UPDATE auteurs SET nom = $1, nationalite = $2
                                         WHERE id = $3 RETURNING *`, [
                                            nom.trim().toLowerCase(),
                                            nationalite.trim().toLowerCase(),
                                            id ]);
        return result.rows[0] || null;
    }


    static async delete(id) {
        const result = await pool.query( 'DELETE FROM auteurs WHERE id = $1 RETURNING *', [id] );
        return result.rows[0] || null;
    }



}


module.exports =  Auteur;