# Application de gestion de bibliothèque

Application web permettant de gérer les auteurs, les livres,
les adhérents et les emprunts d'une bibliothèque de quartier.

## Technologies utilisées

- Node.js
- Express.js
- PostgreSQL
- HTML
- CSS
- JavaScript
- Fetch API

## Fonctionnalités

- CRUD des auteurs
- CRUD des adhérents
- CRUD des livres
- Recherche des livres
- Pagination des livres
- Création d'emprunts
- Retour des livres
- Détection des retards
- Historique des emprunts
- Statistiques
- Tableau de bord

## Installation

### 1. Cloner le projet

```bash
git clone URL_DU_DEPOT
cd bibliotheque
```

### 2. Installer les dépendances

```bash
npm install
```

Sous PowerShell, si npm est bloqué :

```powershell
npm.cmd install
```

### 3. Créer la base de données

Créer une base PostgreSQL appelée :

```text
bibliotheque_db
```

### 4. Configurer les variables d'environnement

Copier `.env.example` vers `.env`.

Puis compléter `.env` :

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bibliotheque_db
DB_USER=postgres
DB_PASSWORD=VOTRE_MOT_DE_PASSE
```

### 5. Créer les tables

Exécuter le fichier `schema.sql` dans PostgreSQL.

Avec le terminal :

```bash
psql -U postgres -d bibliotheque_db -f schema.sql
```

### 6. Démarrer le serveur

```bash
npm start
```

Sous PowerShell :

```powershell
npm.cmd start
```

### 7. Ouvrir l'application

```text
http://localhost:3000
```

## Routes principales

### Auteurs

- `GET /api/auteurs`
- `GET /api/auteurs/:id`
- `POST /api/auteurs`
- `PUT /api/auteurs/:id`
- `DELETE /api/auteurs/:id`

### Adhérents

- `GET /api/adherents`
- `GET /api/adherents/:id`
- `POST /api/adherents`
- `PUT /api/adherents/:id`
- `DELETE /api/adherents/:id`
- `GET /api/adherents/:id/emprunts`

### Livres

- `GET /api/livres`
- `GET /api/livres/:id`
- `POST /api/livres`
- `PUT /api/livres/:id`
- `DELETE /api/livres/:id`

Recherche et pagination :

```text
GET /api/livres?search=hugo&page=1&limit=10
```

### Emprunts

- `GET /api/emprunts`
- `GET /api/emprunts/en-cours`
- `GET /api/emprunts/en-retard`
- `POST /api/emprunts`
- `PUT /api/emprunts/:id/retour`

### Statistiques

- `GET /api/statistiques`

### Santé de l'API

- `GET /api/health`