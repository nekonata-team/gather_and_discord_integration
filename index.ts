import {Game} from "@gathertown/gather-game-client";

const GATHER_API_KEY =
    process.env.GATHER_API_KEY ??
    (() => {
        throw new Error("GATHER_API_KEY is not set");
    })();
const GATHER_SPACE_ID =
    process.env.GATHER_SPACE_ID ??
    (() => {
        throw new Error("GATHER_SPACE_ID is not set");
    })();
const GATHER_MAP_ID = process.env.GATHER_MAP_ID ?? "office-main";
const DISCORD_WEBHOOK_URL =
    process.env.DISCORD_WEBHOOK_URL ??
    (() => {
        throw new Error("DISCORD_WEBHOOK_URL is not set");
    })();

console.log("GATHER_API_KEY", GATHER_API_KEY);
console.log("GATHER_SPACE_ID", GATHER_SPACE_ID);
console.log("GATHER_MAP_ID", GATHER_MAP_ID);
console.log("DISCORD_WEBHOOK_URL", DISCORD_WEBHOOK_URL);

// Discordへメッセージ送信用の関数
async function sendDiscordMessage(content: string) {
    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({content}),
        });
    } catch (error) {
        console.error("Discordへの送信に失敗しました:", error);
    }
}

// Gameオブジェクトの作成と接続
const game = new Game(GATHER_SPACE_ID, () =>
    Promise.resolve({apiKey: GATHER_API_KEY}),
);
game.connect();

game.subscribeToConnection((connected) => {
    console.log("connected?", connected);

    game.subscribeToEvent("playerJoins", async (data) => {
        await game.waitForInit();  // Playerにデータが入るまで待つ

        const encId = data.playerJoins.encId;
        const uid = game.getPlayerUidFromEncId(encId);

        if (!uid) {
            console.error("uid is not found");
            return;
        }

        const player = game.getPlayer(uid);
        const playerCount = Object.keys(game.players).length;

        const message = `Player joined: ${player?.name} (uid: ${uid}). Total players: ${playerCount}.`;
        await sendDiscordMessage(message);
    });

    game.subscribeToEvent("playerExits", async (data) => {
        const encId = data.playerExits.encId;
        const uid = game.getPlayerUidFromEncId(encId);
        const playerCount = Object.keys(game.players).length;

        const message = `Player exited: uid ${uid}. Total players: ${playerCount}.`;
        await sendDiscordMessage(message);
    });
});
