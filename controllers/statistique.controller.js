const pool = require('../config/db.config')



const getStatistiques = async (req, res) => {
  try {
    const totalLivresQuery = `
      SELECT COUNT(*) AS total
      FROM livres;
    `;

    const totalAdherentsQuery = `
      SELECT COUNT(*) AS total
      FROM adherents;
    `;

    const empruntsEnCoursQuery = `
      SELECT COUNT(*) AS total
      FROM emprunts
      WHERE date_retour IS NULL;
    `;

    const empruntsEnRetardQuery = `
      SELECT COUNT(*) AS total
      FROM emprunts
      WHERE date_retour IS NULL
        AND date_retour_prevue < CURRENT_DATE;
    `;

    const livreLePlusEmprunteQuery = `
      SELECT
        l.id,
        l.titre,
        a.nom AS auteur,
        COUNT(e.id) AS nombre_emprunts
      FROM livres l
      INNER JOIN auteurs a
        ON a.id = l.auteur_id
      INNER JOIN emprunts e
        ON e.livre_id = l.id
      GROUP BY
        l.id,
        l.titre,
        a.nom
      ORDER BY nombre_emprunts DESC
      LIMIT 1;
    `;

    const adherentLePlusActifQuery = `
      SELECT
        ad.id,
        ad.nom,
        ad.contact,
        COUNT(e.id) AS nombre_emprunts
      FROM adherents ad
      INNER JOIN emprunts e
        ON e.adherent_id = ad.id
      GROUP BY
        ad.id,
        ad.nom,
        ad.contact
      ORDER BY nombre_emprunts DESC
      LIMIT 1;
    `;

    const [
      totalLivresResult,
      totalAdherentsResult,
      empruntsEnCoursResult,
      empruntsEnRetardResult,
      livreLePlusEmprunteResult,
      adherentLePlusActifResult
    ] = await Promise.all([
      pool.query(totalLivresQuery),
      pool.query(totalAdherentsQuery),
      pool.query(empruntsEnCoursQuery),
      pool.query(empruntsEnRetardQuery),
      pool.query(livreLePlusEmprunteQuery),
      pool.query(adherentLePlusActifQuery)
    ]);

    const livreLePlusEmprunte =
      livreLePlusEmprunteResult.rows[0] || null;

    const adherentLePlusActif =
      adherentLePlusActifResult.rows[0] || null;

    res.status(200).json({
      totalLivres: Number(
        totalLivresResult.rows[0].total
      ),

      totalAdherents: Number(
        totalAdherentsResult.rows[0].total
      ),

      empruntsEnCours: Number(
        empruntsEnCoursResult.rows[0].total
      ),

      empruntsEnRetard: Number(
        empruntsEnRetardResult.rows[0].total
      ),

      livreLePlusEmprunte:
        livreLePlusEmprunte
          ? {
              id: livreLePlusEmprunte.id,
              titre: livreLePlusEmprunte.titre,
              auteur: livreLePlusEmprunte.auteur,
              nombre_emprunts: Number(
                livreLePlusEmprunte
                  .nombre_emprunts
              )
            }
          : null,

      adherentLePlusActif:
        adherentLePlusActif
          ? {
              id: adherentLePlusActif.id,
              nom: adherentLePlusActif.nom,
              contact: adherentLePlusActif.contact,
              nombre_emprunts: Number(
                adherentLePlusActif
                  .nombre_emprunts
              )
            }
          : null
    });
  } catch (error) {
    console.error(
      'Erreur lors du calcul des statistiques :',
      error
    );

    res.status(500).json({
      message:
        'Impossible de récupérer les statistiques'
    });
  }
};

module.exports = {
  getStatistiques
};