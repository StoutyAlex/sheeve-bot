require('dotenv').config();
const Discord = require('discord.js');

const { handleCommand, handleResponse } = require('./src/handler');
const { token, commandPrefix } = require('./src/config');

const bot = new Discord.Client();

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', (message) => {
  if (message.author === bot.user) return; // don't respond to its own messages

  const { content } = message;
  // change this to regex
  const response = content.startsWith(commandPrefix) ? handleCommand(message) : handleResponse(message);
});

bot.login(token);
