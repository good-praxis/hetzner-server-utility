import { initalize, loadById } from './modules/schema';

require('dotenv').config();
initalize();
const server = loadById('1');
if (server.server.state === undefined) {
  // Contact Hetzner API here

  console.log(server);
}

console.log('loaded without errors');
