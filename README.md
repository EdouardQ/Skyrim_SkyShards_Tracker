# Skyrim SkyShards Tracker

An interactive Skyrim Skyshards map with location search, progress tracking,
JSON import/export, and a French/English interface.

## Development

Use Node.js 24 and pnpm 11.19.0:

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

`src/` contains the application and its tests, `public/map/` contains the map,
`public/shards/` contains the images, and `docker/` contains the Nginx configuration.
Dependencies, build output, and caches are excluded from Git.

## Docker Deployment with an Existing Cloudflare Tunnel

Requirements: Docker with Compose and an existing Docker network named exactly
`clouflare`. The tunnel container must be connected to the same network.

From the project directory:

```sh
docker compose up -d --build
docker compose ps
```

In your existing tunnel configuration, set the service URL to:

```text
http://skyrim-skyshards:80
```

The `skyrim-skyshards` service is reachable by name on the shared network.
No ports are published on the host. The tunnel provides public HTTPS access,
while Nginx receives HTTP requests within the Docker network.
This project does not add a cloudflared container or a tunnel token.

To inspect the network and logs:

```sh
docker network inspect clouflare
docker compose logs --tail=100 skyrim-skyshards
```

If the network does not exist, create it on the Docker host and connect your
tunnel to it through the tunnel's own Compose configuration:

```sh
docker network create clouflare
```

To update the application after changing the code:

```sh
docker compose up -d --build
```

To stop only this application:

```sh
docker compose down
```

The external network is preserved. The image builds the application with Node
and pnpm, using the dependency versions locked in `pnpm-lock.yaml`, then serves
the build output with Nginx. Node, pnpm, and development dependencies are not
required on the host. The first build requires internet access.

## Progress

Progress is saved in the browser's local storage, without a server-side
database. It is specific to the browser and site address: progress saved on
`localhost` does not automatically appear on the tunnel's new domain.
No Docker volume is required.

## Images

Images are provided in WebP format. The map retains its original dimensions;
other images are limited to 1,600 pixels on their longest side. Static files
are cached, and Nginx compresses text responses.

To convert new JPEG images, place them in `public/shards/`, using each
location's ID as the filename. Then, with Python and Pillow installed, run:

```sh
python -m pip install Pillow
python scripts/optimize-images.py
```

The script prints the temporary directory where the originals are backed up.
It never overwrites an existing WebP file. Python is only a maintenance tool;
neither the Docker image nor the application requires it.

## License and Sources

The code is distributed under the [MIT License](LICENSE). Libraries retain
their respective licenses. This license does not grant rights to maps, images,
trademarks, or other third-party content related to Skyrim.
Image source links are preserved in `src/data/source-snapshot.json` and are
accessible from each location's details card.
