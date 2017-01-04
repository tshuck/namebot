require("babel-polyfill");

import Generator from './generator.js';
import Messenger from './messenger.js';

import Botkit from 'botkit';

const controller = Botkit.slackbot();
const bot = controller.spawn({
  token: process.env.SLACK_TOKEN
});

const generator = new Generator();

generator
  .loadCacheFromCSV()
  .then(function() {
    bot.startRTM();

    const messenger = new Messenger(generator);
    controller.on('ambient', (bot, message) => messenger.ambient(bot, message));
    controller.on('direct_mention', (bot, message) => messenger.mention(bot, message));
  });