import { initalizeKeypair, keypair } from './modules/keymanager';
const Discord = require('discord.js');
require('dotenv').config();

initalizeKeypair();

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

    throw new Error('Server creation not implemented');
  }

  if (command === 'ready') {
    if (args.length === 0) {
      message.channel.send('You need to specify a name for the server!');
      return;
    }
    const name = args[0]; // Prevent white space in name

    throw new Error('Server processing not implemented');
  }
});

discord.login(process.env.DISCORD_TOKEN);

/*client.images.list().then((images: any) => {
  console.log(images);
});

client.images.get(43077996).then((image: any) => {
  console.log(image);
});*/
