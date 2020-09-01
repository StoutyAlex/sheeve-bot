require('dotenv').config();
const Discord = require('discord.js');
const mongoose = require('mongoose');

const { DB_URI } = require('./src/config');
const QuizMessage = require('./src/QuizMessage');

const queue = require('./src/queue');
const state = require('./src/serverState');

const answer = require('./src/commands/quiz/answer');

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

  const serverQueue = queue.get(message.guild.id);
  const serverState = state.get(message.guild.id);

  if (!serverQueue) {
    queue.set(message.guild.id, {
      textChannel: message.channel,
      voiceChannel: message.member.voice.channel || null,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
      ear: true,
    })
  }

  if (!serverState) {
    state.set(message.guild.id, {
      textChannel: message.channel,
      voiceChannel: message.member.voice.channel || null,
      connection: null,
      ear: true,
    });
  }

  const content = message.content;
  
  content.startsWith(commandPrefix) ? handleCommand(message, serverQueue) : handleResponse(message, serverQueue);
});

bot.on('messageReactionAdd', async (messageReaction, user) => {
  const messageId = messageReaction.message.id;
  const userId = user.id

  const emoji = messageReaction._emoji.name;

  if(!['1️⃣', '2️⃣', '3️⃣', '4️⃣'].includes(emoji)) return;

  const quizMess = QuizMessage.get({ messageId: messageId, userId: userId });
  if (!quizMess) return;

  const correct = await answer(quizMess, emoji);

  correct ? messageReaction.message.react('✅') : messageReaction.message.react('❌');
});

bot.login(token);
