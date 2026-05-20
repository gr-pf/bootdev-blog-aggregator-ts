# bootdev-blog-aggregator-ts
boot.dev project to build a blog aggregator *gator* with TypeScript 

**GATOR**, it's a CLI tool that allows users to:

- Add RSS feeds from across the internet to be collected
- Store the collected posts in a PostgreSQL database
- Follow and unfollow RSS feeds that other users have added
- View summaries of the aggregated posts in the terminal, with a link to the full post

---

## Stack technique

- TypeScript
- Node.js
- PostgreSQL
- Drizzle 

---

## Prérequis

Avant de commencer, assure-toi d’avoir installé :

- Node.js >= 20
- PostgreSQL >= 15
- npm / pnpm / yarn

---

## Installation 

### Cloner le dépot

```
git clone git@github.com:gr-pf/bootdev-blog-aggregator-ts.git
cd bootdev-blog-aggregator-ts
```

### Installer les dépendances
```
npm install
```

--- 

## Configuration 

1. Création de la base SQL :
```
CREATE DATABASE gator;
```

2. Paraméter le fichier de configuration .gatorconfig.json à la racine du fichier :
```
{
  "db_url": "postgres://postgres:postgres@localhost:5432/gator?sslmode=disable"
}
```
A adapter à partir du modèle :
```
protocol://username:password@host:port/database?sslmode=disable"
```

3. Lancer les migrations :
```
npm run migrate
ou 
npx drizzle-kit migrate
```

---

## Commandes disponibles :

Toutes les commandes doivent s'executer à partir d'un script de la forme suivante :
```
npm run start <command> <options>
```

Liste des commandes :

- reset : réinitialise la bdd
- register <user> : crée un nouvel utilisateur et le connecte
- login <user> : connecte un utilisateur existant
- users : liste les utilisateurs et indique l'utilisateur logué
- addfeed <feed_name> <feed_url> : ajoute le feed à l'utilisateur logué
- feeds : liste des feeds
- follow <feed_url> : l'utilisateur logué follow le feed déjà renseigné dans la base
- unfollow <feed_url> : l'utilisateur logué unfollow le feed
- following : liste des feeds suivi par l'utilisateur logué
- agg <interval> : aggrége les posts des feeds en boucle suivant l'interval défini (CTRL+C pour arrêter la loop d'aggrégation)
- browse <number_of_post> : affiche les derniers posts publiés

Un script pour tester :
```
npm run start reset
npm run start register alice
npm run start register bob
npm run start users
npm run start login alice
npm run start addfeed "HackerNews" "https://hnrss.org/frontpage"
npm run start addfeed "BBC" "https://feeds.bbci.co.uk/news/rss.xml"
npm run start feeds
npm run start follow "https://hnrss.org/frontpage"
npm run start following
npm run start login bob
npm run start follow "https://feeds.bbci.co.uk/news/rss.xml"
npm run start following
npm run start unfollow "https://feeds.bbci.co.uk/news/rss.xml"
npm run start following
npm run start agg 10s
```
Et dans un second terminal :
```
npm run start browse 10
```
**Bien penser à tuer la loop _agg_**
