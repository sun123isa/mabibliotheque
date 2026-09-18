const pool = require('../config/db.config')

class Adherent {

    static async findAll(){
        const result = await pool.query(
        'SELECT * FROM adherents'
        );
        return result.rows || null;
    }

    static async findById(id){
        const result = await pool.query(
        'SELECT * FROM adherents WHERE id = $1 ', [id]
        );
        return result.rows[0] || null;
    }

    static async create({nom , contact}){
        const result = await pool.query(`INSERT INTO adherents (nom , contact) 
            VALUES ($1, $2) RETURNING *`,[nom.trim().toLowerCase(), contact || null]);
        return result.rows[0] || null;
    }

    static async update(id, { nom, contact }){
        const result = await pool.query(`UPDATE adherents SET nom = $1, contact = $2
                                         WHERE id = $3 RETURNING *`, [
                                            nom.trim().toLowerCase(),
                                            contact || null,
                                            id
                                        ]);
        return result.rows[0] || null;
    }


    static async delete(id) {
        const result = await pool.query( 'DELETE FROM adherents WHERE id = $1 RETURNING *', [id] );
        return result.rows[0] || null;
    }



}


module.exports =  Adherent;