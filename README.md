# Skyrim SkyShards Tracker

Carte interactive des Skyshards de Skyrim : recherche par lieu, suivi de
progression, import/export JSON et interface français/anglais.

## Développement

Utiliser Node.js 24 et pnpm 11.19.0 :

```sh
npm install --global pnpm@11.19.0
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm typecheck
pnpm test
pnpm build
```

`src/` contient l'application et ses tests ; `public/map/` la carte,
`public/shards/` les illustrations ; `docker/` la configuration Nginx.
Les dépendances, les fichiers compilés et les caches restent hors de Git.

## Déploiement Docker avec le tunnel Cloudflare existant

Prérequis : Docker avec Compose, et un réseau Docker existant nommé exactement
`clouflare`. Le conteneur du tunnel doit être connecté à ce même réseau.

Depuis le dossier du projet :

```sh
docker compose up -d --build
docker compose ps
```

Dans la configuration de votre tunnel existant, définir l'URL du service :

```text
http://skyrim-skyshards:80
```

Le service `skyrim-skyshards` est joignable par son nom sur le réseau partagé.
Aucun port n'est publié sur l'hôte. Le tunnel assure l'accès HTTPS public ;
Nginx reçoit les requêtes HTTP à l'intérieur du réseau Docker.
Le projet n'ajoute pas de conteneur cloudflared ni de token de tunnel.

Pour vérifier le réseau et les logs :

```sh
docker network inspect clouflare
docker compose logs --tail=100 skyrim-skyshards
```

Si le réseau est absent, le créer sur l'hôte Docker et y connecter également
votre tunnel via sa propre configuration Compose :

```sh
docker network create clouflare
```

Pour mettre à jour après modification du code :

```sh
docker compose up -d --build
```

Pour arrêter uniquement cette application :

```sh
docker compose down
```

Le réseau externe est conservé. L'image compile les sources avec Node et pnpm
(versions des dépendances verrouillées par `pnpm-lock.yaml`), puis Nginx sert
le résultat. Node, pnpm et les dépendances de développement ne sont pas requis
sur l'hôte. La première construction nécessite un accès Internet.

## Progression

La progression est conservée dans le stockage local du navigateur, sans base
de données serveur. Elle dépend du navigateur et de l'adresse utilisée :
la progression enregistrée sur `localhost` n'apparaît pas automatiquement sur
le nouveau domaine du tunnel. Aucun volume Docker n'est nécessaire.

## Images

Les images livrées sont au format WebP. La carte conserve ses dimensions
d'origine ; les illustrations sont limitées à 1600 pixels sur leur plus grand
côté. Les fichiers statiques sont mis en cache et Nginx compresse les textes.

Pour convertir de nouvelles images JPEG, placer les illustrations dans
`public/shards/` en utilisant l'identifiant du lieu comme nom de fichier,
puis lancer, avec Python et Pillow installés :

```sh
python -m pip install Pillow
python scripts/optimize-images.py
```

Le script indique le dossier temporaire où sont conservés les originaux.
Il ne remplace jamais un WebP existant. Python est uniquement un outil de
maintenance ; il n'est nécessaire ni à Docker ni à l'application.

## Licence et sources

Le code est distribué sous [licence MIT](LICENSE). Les bibliothèques conservent
leurs licences respectives. Cette licence ne concède pas de droits sur les
cartes, images, marques ou autres contenus tiers liés à Skyrim.
Les liens sources des illustrations sont conservés dans
`src/data/source-snapshot.json` et accessibles depuis les fiches des lieux.
