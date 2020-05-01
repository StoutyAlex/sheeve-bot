require('dotenv').config();
const Discord = require('discord.js');

const { handleCommand, handleResponse } = require('./src/handler');
const { token, commandPrefix } = require('./src/config');

const bot = new Discord.Client();

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', (message) => {
  const senderId = message.author.id;
  if (senderId === bot.user.id) return;

  const { content } = message;
  return content.startsWith(commandPrefix) ? handleCommand(message) : handleResponse(message);
});

bot.login(token);
