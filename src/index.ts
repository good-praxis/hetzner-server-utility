import {
  createNewServer,
  loadByName,
  initalize,
  setToLive,
  ServerState
} from './modules/server';
import { initalizeApi } from './modules/hcloud';
import { initalizeKeys } from './modules/keymanager';
const Discord = require('discord.js');
require('dotenv').config();

initalizeKeys();
initalize();
initalizeApi();

const discord = new Discord.Client();

discord.on('ready', () => {
  console.log(`Logged in as ${discord.user.tag}!`);
});

discord.on('message', (message: any) => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice('!'.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'create') {
    if (args.length === 0) {
      message.channel.send('You need to specify a name for the server!');
      return;
    }
    const name = args[0]; // Prevent white space in name

    if (loadByName(name)) {
      message.channel.send(`A server with the name "${name}" already exists`);
      return;
    }

    createNewServer(name)
      .then(({ server }) => {
        message.channel.send(
          `${name}-Server has been initalized at ${server.ip}!`
        );
      })
      .catch(console.error);

    message.channel.send(`Creation in process...`);
  }

  if (command === 'ready') {
    if (args.length === 0) {
      message.channel.send('You need to specify a name for the server!');
      return;
    }
    const name = args[0]; // Prevent white space in name

    if (!loadByName(name)) {
      message.channel.send(`No server with the name "${name}" found`);
      return;
    }

    if (loadByName(name).server.state !== ServerState.CREATED) {
      message.channel.send(`Cannot set server "${name}" to Live`);
      return;
    }

    setToLive(name);
    message.channel.send(`${name}-Server is now live!`);
    return;
  }
});

discord.login(process.env.DISCORD_TOKEN);

/*client.images.list().then((images: any) => {
  console.log(images);
});

client.images.get(43077996).then((image: any) => {
  console.log(image);
});*/

console.log('loaded without errors');
