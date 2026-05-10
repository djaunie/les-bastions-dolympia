# Les Bastions d'Olympia

Site web statique pour la campagne narrative Warhammer 40,000 — **Les Bastions d'Olympia**.

> **Site en ligne :** [djaunie.github.io/les-bastions-dolympia](https://djaunie.github.io/les-bastions-dolympia)

---

## Structure du projet

```
les-bastions-dolympia/
├── index.html                        # Page d'accueil — hub de navigation principal
├── carte.html                        # Carte interactive du théâtre d'opérations
├── blood-angels.html                 # Fiche armée — Blood Angels
├── iron-warriors.html                # Fiche armée — Iron Warriors
├── night-lords.html                  # Fiche armée — Night Lords
├── README.md
└── assets/
    ├── css/                          # Feuilles de style (thème Warhammer 40K sombre)
    ├── js/                           # Scripts JavaScript (interactions, carte dynamique, scores)
    ├── img/                          # Images, illustrations et bannières des factions
    └── data/                         # Données JSON (scores, armées, résultats de batailles)
```

---

## Technologies utilisées

- **HTML5 / CSS3** — site entièrement statique, sans framework front-end
- **JavaScript vanilla** — gestion des interactions, carte dynamique, navigation et calcul des scores
- **JSON** — stockage des données de campagne (résultats, scores, fiches armées)
- **GitHub Pages** — hébergement gratuit et déploiement automatique depuis la branche `master`
- **Git** — gestion de version et collaboration entre joueurs

---

## Cloner et travailler en local

### 1. Cloner le dépôt

```bash
git clone https://github.com/djaunie/les-bastions-dolympia.git
cd les-bastions-dolympia
```

### 2. Ouvrir le site en local

Ouvrir directement `index.html` dans un navigateur, ou utiliser l'extension **Live Server** (VS Code).

---

## Workflow Git — modifier et publier

### Modifier un fichier et pousser les changements

```bash
# 1. Vérifier l'état des fichiers modifiés
git status

# 2. Ajouter les fichiers modifiés au prochain commit
git add nom-du-fichier.html
# ou tout ajouter d'un coup :
git add .

# 3. Créer le commit avec un message descriptif
git commit -m "Mise à jour fiche Blood Angels"

# 4. Pousser vers GitHub (branche master)
git push origin master
```

### Récupérer les dernières modifications (si travail à plusieurs)

```bash
git pull origin master
```

### Vérifier l'historique des commits

```bash
git log --oneline
```

---

## Déploiement — GitHub Pages

Le site est déployé automatiquement depuis la branche `master` via **GitHub Pages**.

Pour activer ou vérifier le déploiement :

1. Aller dans **Settings** du dépôt sur GitHub
2. Section **Pages** → Source : `Deploy from a branch` → branche `master` → dossier `/ (root)`
3. Le site est accessible à l'adresse : `https://djaunie.github.io/les-bastions-dolympia`

Chaque `git push` sur `master` déclenche automatiquement une mise à jour du site (délai ~1 minute).

---

## Ajouter une nouvelle page de faction

```bash
# 1. Créer le fichier HTML à partir d'un modèle existant
cp blood-angels.html nouvelle-faction.html

# 2. Modifier le contenu
# (éditer nouvelle-faction.html dans votre éditeur)

# 3. Ajouter un lien dans index.html
# (éditer index.html pour ajouter la navigation)

# 4. Pousser
git add nouvelle-faction.html index.html
git commit -m "Ajout page nouvelle-faction"
git push origin master
```

---

## Commandes Git utiles

| Commande                  | Description                                  |
| ------------------------- | -------------------------------------------- |
| `git status`              | Voir les fichiers modifiés / non suivis      |
| `git add .`               | Ajouter tous les changements à l'index       |
| `git commit -m "message"` | Créer un commit                              |
| `git push origin master`  | Envoyer les commits vers GitHub              |
| `git pull origin master`  | Récupérer les derniers commits depuis GitHub |
| `git log --oneline`       | Historique des commits (format court)        |
| `git diff`                | Voir les modifications non encore commitées  |
| `git restore nom-fichier` | Annuler les modifications d'un fichier       |
| `git clone <url>`         | Cloner le dépôt en local                     |
