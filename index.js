require('dotenv').config();
const Discord = require('discord.js');
const mongoose = require('mongoose');

const { DB_URI } = require('./src/config');
const QuizMessage = require('./src/QuizMessage');

mongoose.connect(DB_URI);

const { handleCommand, handleResponse } = require('./src/handler');
const { token, commandPrefix } = require('./src/config');

const bot = new Discord.Client();

bot.on('ready', async () => {
  console.log(`Logged in as ${bot.user.tag}`);
  await QuizMessage.load();
});

bot.on('message', (message) => {
  if (message.author === bot.user) return; // don't respond to its own messages

  const content = message.content;
  
  content.startsWith(commandPrefix) ? handleCommand(message) : handleResponse(message);
});

bot.on('messageReactionAdd', async (messageReaction, user) => {
  const messageId = messageReaction.message.id;
  const userId = user.id

  const quizMess = QuizMessage.get({ messageId: messageId, userId: userId });
  if (!quizMess) return; // user was not owner of message

  await answer(quizMess);
});

bot.login(token);
