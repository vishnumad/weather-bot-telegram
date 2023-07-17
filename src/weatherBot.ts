import TelegramBot, { InlineKeyboardButton, Message } from 'node-telegram-bot-api';
import { getEnvVars } from './utils/environment';

const weatherBot = async (telegramBot: TelegramBot): Promise<void> => {
  const getUsername = async (): Promise<string> => {
    const bot = await telegramBot.getMe();

    return `@${bot.username}` ?? '@unknown_username';
  };

  const username = await getUsername();

  console.info(`Starting Das Wetter Bot ${username}...`);

  const getAuthorizedUsers = (): Array<number> => {
    const environment = getEnvVars();

    return environment.authorizedUsers.split(',').map((id) => parseInt(id, 10));
  };

  const authorizedUsers = getAuthorizedUsers();

  const weatherBotOnCommand = (regexp: RegExp, callback: (msg: Message) => void) => {
    telegramBot.onText(regexp, (message) => {
      if (!authorizedUsers.includes(message.chat.id)) {
        telegramBot.sendMessage(message.chat.id, `You're not authorized to use this bot.`);
        return;
      }

      callback(message);
    });
  };

  weatherBotOnCommand(/\/start/, (message) => {
    const responseInlineKeyboard: InlineKeyboardButton[][] = new Array<
      Array<InlineKeyboardButton>
    >();

    responseInlineKeyboard.push([
      {
        text: 'Settings',
        callback_data: '/settings',
      },
    ]);

    telegramBot.sendMessage(message.chat.id, 'Hello!', {
      reply_markup: {
        inline_keyboard: responseInlineKeyboard,
      },
    });
  });

  telegramBot.on('callback_query', (query) => {
    console.log(JSON.stringify(query));

    telegramBot.answerCallbackQuery(query.id, {
      callback_query_id: query.id,
    });
  });

  console.info(`${username} is now ready to provide weather info...`);
};

export default weatherBot;
