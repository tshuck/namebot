require("babel-polyfill");

import Generator from './generator.js';
import Messenger from './messenger.js';

import Botkit from 'botkit';

const slack_token = 'xoxb-123124703397-zGfOtUn0nM16sQ8z3TOzmwBo';

const controller = Botkit.slackbot();
const bot = controller.spawn({
  token: slack_token
});

const generator = new Generator();

generator
  .loadCacheFromCSV()
  .then(function() {
    bot.startRTM();
    
    console.log(generator.has);
    const messenger = new Messenger(generator);

    controller.on('ambient', (bot, message) => messenger.ambient(bot, message));
    controller.on('direct_mention', (bot, message) => messenger.mention(bot, message));
  });