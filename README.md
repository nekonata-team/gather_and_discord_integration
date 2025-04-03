# gather_and_discord_integration

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

This project was created using `bun init` in bun v1.2.7. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Dcoker

This project also includes a `docker-compose.yml` file for running the application in a Docker container.

To run:

```bash
docker compose up -d
```

## Setup

Create a `.env` file in the root directory and add your Discord bot token:

```env
GATHER_API_KEY=xxxxxxxxxxxx
GATHER_SPACE_ID=xxxxxxxxxxxxxxxxx
GATHER_MAIN_ROOM_ID=office-main # This is dealt as map id
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxxx/xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
