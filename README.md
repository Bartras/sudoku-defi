# Sudoku – Le Défi 🧩

Une grille de Sudoku à résoudre sur téléphone ou ordinateur, pour défier un collègue.
Simple, sans compte, sans publicité, et qui marche même sans connexion une fois la page chargée.

**Jouer : https://bartras.github.io/sudoku-defi/**

## Fonctionnalités

- **Grille n° 72, niveau 6 (Hard)** : 26 chiffres donnés, solution unique.
- **Saisie** au pavé numérique à l'écran ou au clavier (1 à 9).
- **Notes au crayon** pour les candidats de chaque case.
- **Annuler** autant d'actions que nécessaire, **Effacer** une case, **Recommencer** la grille.
- **Aides visuelles** : ligne, colonne et bloc de la case sélectionnée, mise en évidence des chiffres identiques, nombre de chiffres restants à placer sur chaque touche.
- **Doublons signalés en direct** (ligne, colonne ou bloc) et bouton **Vérifier**.
- **Chrono** et **compteur d'erreurs** (un doublon créé = une erreur).
- **Résultat à partager** : à la fin, un bouton copie un message avec le temps et les erreurs, à renvoyer à son adversaire.
- **Partie sauvegardée** automatiquement dans le navigateur : on peut fermer la page et reprendre plus tard.
- **Mode sombre** automatique, interface adaptée au téléphone.

## Règles

- Chaque ligne, chaque colonne et chaque bloc de 3×3 contient les chiffres de 1 à 9, une seule fois.
- Les chiffres en **gras** sont imposés, ceux en couleur sont ceux que tu places.
- La grille n'a qu'une solution : elle est validée dès qu'elle est complète et sans aucun doublon. La solution n'est pas stockée dans le code.

## Raccourcis clavier

| Touche | Action |
| --- | --- |
| `1` à `9` | Saisir un chiffre (ou une note si le mode notes est actif) |
| Flèches | Déplacer la sélection |
| `N` | Activer / désactiver les notes |
| `Suppr` / `Retour arrière` | Effacer la case |
| `Ctrl` + `Z` | Annuler |

## Pour les développeurs

Pas de framework ni de compilation : un seul fichier HTML avec son CSS et son JavaScript.

| Fichier | Rôle |
| --- | --- |
| `index.html` | Toute l'application (grille, règles, chrono, sauvegarde) |

Pour tester en local, servir le dossier avec un petit serveur, par exemple :

```
python3 -m http.server 8000
```

puis ouvrir `http://localhost:8000`.

La grille est définie par la constante `PUZZLE` au début du script (81 caractères, `.` pour une case vide). Pour changer de grille, modifier cette chaîne et la clé `KEY` (sinon l'ancienne sauvegarde du navigateur est rechargée), ainsi que le titre affiché sous l'en-tête.

Le site est publié avec **GitHub Pages**.
