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

console.log("GATHER_API_KEY", GATHER_API_KEY);
console.log("GATHER_SPACE_ID", GATHER_SPACE_ID);
console.log("GATHER_MAP_ID", GATHER_MAP_ID);

// create the game object, giving it your spaceId and API key of your choice in this weird way
const game = new Game(GATHER_SPACE_ID, () =>
    Promise.resolve({apiKey: GATHER_API_KEY}),
);
// this is the line that actually connects to the server and starts initializing stuff
game.connect();
// optional but helpful callback to track when the connection status changes
game.subscribeToConnection((connected) => {
    console.log("connected?", connected);

    game.subscribeToEvent("playerJoins", async (data) => {
        await game.waitForInit();

        const encId = data.playerJoins.encId;
        const uid = game.getPlayerUidFromEncId(encId)!;
        const player = game.getPlayer(uid);
        const playerCount = Object.keys(game.players).length;

        console.log("Player joined");
        console.log(`Player encId: ${encId}`);
        console.log(`Player uid: ${uid}`);
        // console.dir(player);
        console.log(`Player name: ${player?.name}`);
        console.log(`Now player count: ${playerCount}`);
    });
    game.subscribeToEvent("playerExits", (data) => {
        const encId = data.playerExits.encId;
        const uid = game.getPlayerUidFromEncId(encId)!;
        const playerCount = Object.keys(game.players).length;

        console.log("Player exited");
        console.log(`Player encId: ${encId}`);
        console.log(`Player uid: ${uid}`);
        console.log(`Now player count: ${playerCount}`);
    });
});