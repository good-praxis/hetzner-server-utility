import { initalize, loadById } from "./modules/schema";

initalize();
const server = loadById("1");
if (server.server.state === undefined) {
    // Contact Hetzner API here

}

console.log("loaded without errors");
