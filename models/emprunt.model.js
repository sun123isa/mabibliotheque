const pool = require('../config/db.config')

class Emprunt {

    static async findAll() {
        const result = await pool.query(
            `SELECT
         emprunts.id,
         emprunts.adherent_id,
         adherents.nom AS adherent,
         emprunts.livre_id,
         livres.titre AS livre,
         emprunts.date_emprunt,
         emprunts.date_retour_prevue,
         emprunts.date_retour,
         CASE
           WHEN emprunts.date_retour IS NOT NULL THEN 'termine'
           WHEN emprunts.date_retour_prevue < CURRENT_DATE THEN 'en_retard'
           ELSE 'en_cours'
         END AS statut
       FROM emprunts
       JOIN adherents
         ON emprunts.adherent_id = adherents.id
       JOIN livres
         ON emprunts.livre_id = livres.id
       ORDER BY emprunts.date_emprunt DESC`
        );
        return result.rows || null;
    }

    static async findById(id) {
        const result = await pool.query(
            `SELECT
         emprunts.id,
         emprunts.adherent_id,
         adherents.nom AS adherent,
         emprunts.livre_id,
         livres.titre AS livre,
         emprunts.date_emprunt,
         emprunts.date_retour_prevue,
         emprunts.date_retour,
         CASE
           WHEN emprunts.date_retour IS NOT NULL THEN 'termine'
           WHEN emprunts.date_retour_prevue < CURRENT_DATE THEN 'en_retard'
           ELSE 'en_cours'
         END AS statut
       FROM emprunts 
       JOIN adherents
         ON emprunts.adherent_id = adherents.id
       JOIN livres
         ON emprunts.livre_id = livres.id
    WHERE emprunts.id = $1
       ORDER BY emprunts.date_emprunt DESC`, [id]
        );
        return result.rows[0] || null;
    }

    static async findAllEnCours() {
        const result = await pool.query(
            `SELECT
         emprunts.id,
         adherents.nom AS adherent,
         livres.titre AS livre,
         emprunts.date_emprunt,
         emprunts.date_retour_prevue,
         CASE
           WHEN emprunts.date_retour_prevue < CURRENT_DATE
           THEN 'en_retard'
           ELSE 'en_cours'
         END AS statut
       FROM emprunts
       JOIN adherents
         ON emprunts.adherent_id = adherents.id
       JOIN livres
         ON emprunts.livre_id = livres.id
       WHERE emprunts.date_retour IS NULL
       ORDER BY emprunts.date_retour_prevue ASC`
        );
        return result.rows || null;
    }

    static async findAllEnRetard() {
        const result = await pool.query(
            `SELECT
         emprunts.id,
         emprunts.adherent_id,
         adherents.nom AS adherent,
         emprunts.livre_id,
         livres.titre AS livre,
         emprunts.date_emprunt,
         emprunts.date_retour_prevue,
         emprunts.date_retour,
         'en_retard' AS statut
       FROM emprunts
       JOIN adherents
         ON emprunts.adherent_id = adherents.id
       JOIN livres
         ON emprunts.livre_id = livres.id
       WHERE emprunts.date_retour IS NULL
         AND emprunts.date_retour_prevue < CURRENT_DATE
       ORDER BY emprunts.date_retour_prevue ASC`
        );
        return result.rows || null;
    }

    static async create({ adherent_id, livre_id, date_retour_prevue }) {

        // Demande une connexion au pool
        const client = await pool.connect();

        try {

            // Démarre la transaction
            await client.query('BEGIN');

            // Première requête avec ce client
            const adherentResult = await client.query(
                'SELECT * FROM adherents WHERE id = $1',
                [adherent_id]
            );

            if (adherentResult.rows.length === 0) {
                await client.query('ROLLBACK');
                const error = new Error("Adhérent non trouvé");
                error.statusCode = 404; // On peut y attacher un code HTTP
                throw error;
            }
            // Deuxième requête avec le même client
            const livreResult = await client.query(
                `SELECT *
                FROM livres
                WHERE id = $1
                FOR UPDATE`,
                [livre_id]
            );

            if (livreResult.rows.length === 0) {
                await client.query('ROLLBACK');

                const error = new Error("Livre non trouvé");
                error.statusCode = 404; // On peut y attacher un code HTTP
                throw error;
            }

            const livre = livreResult.rows[0];

            if (livre.statut !== 'disponible') {
                await client.query('ROLLBACK');
                const error = new Error("Ce livre est déjà emprunté");
                error.statusCode = 409; // On peut y attacher un code HTTP
                throw error;
            }
            // Troisième requête avec le même client
            const empruntResult = await client.query(
                `INSERT INTO emprunts (
         adherent_id,
         livre_id,
         date_retour_prevue
       )
       VALUES ($1, $2, $3)
       RETURNING *`,
                [
                    adherent_id,
                    livre_id,
                    date_retour_prevue
                ]
            );



            // QUATRIsième requête avec le même client
            await client.query(
                `UPDATE livres
       SET statut = 'emprunte'
       WHERE id = $1`,
                [livre_id]
            );

            await client.query('COMMIT');

            return empruntResult.rows[0];

        } catch (error) {
            await client.query('ROLLBACK');

            console.error(
                'Erreur lors de la création de l’emprunt :',
                error.message
            );

            error.statusCode = 500; // On peut y attacher un code HTTP
            throw error;

        } finally {
            client.release();
        }
    };

    static async faireRetourEmprunt(id) {

        // Demande une connexion au pool
        const client = await pool.connect();

        try {
            
            await client.query('BEGIN');

            const empruntResult = await client.query(
                `SELECT *
                FROM emprunts
                WHERE id = $1
                FOR UPDATE`,
                [id]
            );

            if (empruntResult.rows.length === 0) {
                await client.query('ROLLBACK');
                const error = new Error("Ce livre est déjà emprunté");
                error.statusCode = 404; // On peut y attacher un code HTTP
                throw error;
            }

            const emprunt = empruntResult.rows[0];

            if (emprunt.date_retour !== null) {
                await client.query('ROLLBACK');
                const error = new Error("Ce livre a déjà été rendu");
                error.statusCode = 409; // On peut y attacher un code HTTP
                throw error;
            }

            const retourResult = await client.query(
                `UPDATE emprunts
                SET date_retour = CURRENT_DATE
                WHERE id = $1
                RETURNING *`,
                [id]
            );

            await client.query(
                `UPDATE livres
                SET statut = 'disponible'
                WHERE id = $1`,
                [emprunt.livre_id]
            );

            await client.query('COMMIT');
            return retourResult.rows[0];
            
        } catch (error) {
            await client.query('ROLLBACK');

            console.error(
                'Erreur lors de l’enregistrement du retour :',
                error.message
            );

            error.message = "Ce livre a déjà été rendu";
            error.statusCode = 500; // On peut y attacher un code HTTP
            throw error;
       
        } finally {
            client.release();
        }

    };


}


module.exports = Emprunt;