export default class {
  constructor(generator) {
    this.commnands = ['add', 'remove', 'list'];
    this.generator = generator;
  }

  to_pieces(message) {
    return message
            .split(' ')
            .map((piece) => piece.toLowerCase());
  }

  ambient(bot, message) {
    const pieces = this.to_pieces(message.text);
    const all_replies = pieces.filter((piece) => this.generator.has(piece));
    const unique_replies = [...new Set(all_replies)];

    unique_replies.forEach((name) => bot.reply(message, this.generator.nickname(name)));
  }

  mention(bot, message) {
    const pieces = this.to_pieces(message.text);

    switch(pieces[0]) {
      case 'add':
        if(pieces.length === 1 || pieces.length < 4 || pieces.length > 5) {
          bot.reply(message, '`Format: @jimjam add <name> <first_letter>(char,char), <second_letter>(char,char), <length>(int:optional)`');
        } else {
          this.generator
            .add(pieces[1], pieces[2].split(','), pieces[3].split(','), pieces[4])
            .then(() => this.list(bot, message));
        }
      break;
      case 'remove':
        if(pieces.length === 1 || pieces.length > 3) {
          bot.reply(message, '`Format: @jimjam remove <name>`');
        } else {
          this.generator
            .remove(pieces[1])
            .then(() => this.list(bot, message));
        }
      break;
      case 'list':
        this.list(bot, message);
      break;
      default:
        bot.reply(message, "One of [add, remove, list].")
      break;
    }
  }

  list(bot, message) {
    if(this.generator.hasCache()) {
      bot.reply(message, '```' + this.generator.printCache() + '```')
    } else {
      bot.reply(message, 'No Nicknames.');
    }
  }

  error(bot, message) {
    bot.reply(message, "You dun fucked up.");
  }
}