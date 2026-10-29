# Sudoku – Le Défi 🧩

Une grille de Sudoku à résoudre sur téléphone ou ordinateur, pour défier un collègue.
Simple, sans compte, sans publicité, et qui marche même sans connexion.

**Jouer : https://bartras.github.io/sudoku-defi/**

## Fonctionnalités

- **Menu d'accueil** avec deux façons de jouer :
  - **Défi du jour** : la grille n° 72, niveau 6 (Hard) du cahier, 26 chiffres donnés, solution unique. C'est la grille à envoyer à un collègue.
  - **Grille aléatoire** en 4 niveaux : Facile, Moyen, Difficile, Expert. Chaque grille est générée dans le navigateur et n'a qu'une seule solution.
- **Lien de défi** : chaque grille aléatoire a un numéro. Le bouton « 🔗 Lien du défi » (et le message de fin de partie) donne un lien qui ouvre exactement la même grille chez l'adversaire.
- **Saisie** au pavé numérique à l'écran ou au clavier (1 à 9).
- **Notes au crayon** pour les candidats de chaque case.
- **Annuler** autant d'actions que nécessaire, **Effacer** une case, **Recommencer** la grille.
- **Aides visuelles** : ligne, colonne et bloc de la case sélectionnée, mise en évidence des chiffres identiques, nombre de chiffres restants à placer sur chaque touche.
- **Doublons signalés en direct** (ligne, colonne ou bloc) et bouton **Vérifier**.
- **Indice** (💡, +30 s au chrono) : signale d'abord une case incorrecte s'il y en a une, sinon révèle la case sélectionnée (ou la plus facile). Les cases révélées sont en vert et verrouillées.
- **Classement** : les 10 meilleurs temps par catégorie (défi du jour, Facile, Moyen, Difficile, Expert), avec erreurs et indices. Il est stocké sur l'appareil, il n'est pas partagé entre joueurs.
- **Chrono** et **compteur d'erreurs** (un doublon créé = une erreur).
- **Résultat à partager** : à la fin, un bouton copie un message avec le temps et les erreurs, à renvoyer à son adversaire.
- **Partie sauvegardée** automatiquement dans le navigateur : on peut fermer la page et reprendre plus tard.
- **Mode sombre** automatique, interface adaptée au téléphone.

## Les niveaux

La difficulté d'une grille aléatoire est mesurée par la technique la plus avancée nécessaire pour la résoudre sans deviner.

| Niveau | Chiffres donnés | Technique la plus avancée |
| --- | --- | --- |
| Facile | ≈ 40 | Case qui n'a plus qu'une seule possibilité |
| Moyen | ≈ 32 | Chiffre qui ne peut aller qu'à un seul endroit d'une ligne, colonne ou bloc |
| Difficile | ≈ 28 | Paires de candidats, alignements bloc/ligne (pointing, claiming) |
| Expert | ≈ 24 à 30 | Au-delà : techniques avancées (X-wing…) ou hypothèse |

Le défi du jour se résout, lui, avec les techniques du niveau Moyen.

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

## Installer sur son téléphone

L'application est une **PWA** : elle s'installe depuis le navigateur, sans passer par un magasin d'applications.

- **Android (Chrome, Brave…)** : ouvrir le lien, menu ⋮ puis *Installer l'application* (ou *Ajouter à l'écran d'accueil*).
- **iPhone** : ouvrir le lien dans **Safari**, bouton Partager puis *Sur l'écran d'accueil*.

Une fois installée, elle fonctionne sans connexion. Les données (partie en cours) restent sur le téléphone, rien n'est envoyé sur Internet.

## Pour les développeurs

Pas de framework ni de compilation : un seul fichier HTML avec son CSS et son JavaScript.

| Fichier | Rôle |
| --- | --- |
| `index.html` | Interface : menu, grille, chrono, sauvegarde |
| `engine.js` | Moteur : résolution, génération avec graine, notation de la difficulté |
| `manifest.webmanifest` | Nom, couleurs et icônes pour l'installation |
| `sw.js` | Service worker : fonctionnement hors connexion |
| `icons/` | Icônes de l'application |

Pour tester en local, servir le dossier avec un petit serveur, par exemple :

```
python3 -m http.server 8000
```

puis ouvrir `http://localhost:8000`.

La grille du défi du jour est définie par `DAILY.puzzle` au début du script (81 caractères, `.` pour une case vide). Pour la changer, modifier cette chaîne, `DAILY.key` (sinon l'ancienne sauvegarde du navigateur est rechargée) et les libellés « n° 72 ».

Les grilles aléatoires viennent de `SudokuEngine.generate(niveau, graine)` : même niveau et même graine donnent la même grille. Le lien de défi est de la forme `#g=moyen-123456`. Le moteur est utilisable sous Node (`require('./engine.js')`).

Le site est publié avec **GitHub Pages**. Après une modification importante, augmenter le numéro de version du cache dans `sw.js` (`sudoku-vN`) pour forcer la mise à jour chez les utilisateurs.
