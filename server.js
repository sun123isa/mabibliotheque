const express =  require('express')
const path  =  require('path')
require('dotenv').config()


const app = express()
const PORT = process.env.PORT || 3000

app.use(logger);
app.use(express.json())

/* importation des routes */
const livreRoutes = require('./routes/livre.route')
const auteurRoutes = require('./routes/auteur.route')
const adherentRoutes = require('./routes/adherent.route')
const empruntRoutes = require('./routes/emprunt.route')
const statistiqueRoutes = require('./routes/statistique.route')




/* implementtaion de route */
app.use('/api/livres', livreRoutes);
app.use('/api/auteurs', auteurRoutes);
app.use('/api/adherents', adherentRoutes);
app.use('/api/emprunts', empruntRoutes);
app.use('/api/statistiques', statistiqueRoutes);

/* liaison avec la vue */
app.use(
  express.static(
    path.join(__dirname, 'frontend')
  )
);

app.get('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, 'frontend', 'index.html')
  );
});


/* GLOBAL ******/
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API fonctionnelle'
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Route non trouvée'
  });
});
app.use((error, req, res, next) => {
  console.error('Erreur globale :', error);

  res.status(500).json({
    message: 'Une erreur interne est survenue'
  });
});


/* *********** */
app.listen(PORT, () => {
  console.log(
    `Serveur lancé sur http://localhost:${PORT}`
  );
});