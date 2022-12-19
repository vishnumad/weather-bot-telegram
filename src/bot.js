import TelegramBot from 'node-telegram-bot-api';
import { getLocationInfo, getCitySuggestions } from './geo';
import { getWeather } from './weather';
import { formattedMessage } from './formatting';
import { get as envConfigured } from './environment';

const queryCacheTime = 7 * 60 * 60 * 24; // 7 days
const userToChatMap = new Map();

function weatherBot() {
  console.info('Starting Das Wetter Bot!');

  const environment = envConfigured();

  const botId = Number(environment.telegramToken.split(':')[0]);
  const authorizedUsers = environment.authorizedUsers.split(',').map((id) => parseInt(id, 10));

  const bot =
    environment.nodeEnv === 'production'
      ? new TelegramBot(environment.telegramToken, {
          polling: false,
          filepath: false,
          webHook: {
            port: 443,
            host: '0.0.0.0',
          },
        })
      : new TelegramBot(environment.telegramToken, {
          polling: true,
          filepath: false,
        });

  if (environment.nodeEnv === 'production') {
    bot.setWebHook(`${process.env.APP_URL}/bot${process.env.TELEGRAM_TOKEN}`);
  }

  console.info('Web hook / polling configured...');

  bot.onText(/\/ping/, handlePing);
  bot.onText(/\/start/, handleStart);
  bot.onText(/\/help/, handleHelp);

  bot.on('inline_query', handleInlineQuery);
  bot.on('message', handleMessage);
  bot.on('chosen_inline_result', handleChosenInlineResult);

  function handlePing(message) {
    console.info(`Processing ping command for ${message.chat.id}`);

    bot.sendMessage(message.chat.id, 'This server is better than HWS! 🤯');
  }

  function handleStart(message) {
    if (!authorizedUsers.includes(message.chat.id)) {
      console.warn(`Ignore request from ${message.chat.id}!`);

      bot.sendMessage(message.chat.id, 'Unauthorized user.');
    } else {
      bot.sendMessage(message.chat.id, `Use ${environment.botUsername} <location>`);
    }
  }

  function handleHelp(message) {
    if (!authorizedUsers.includes(message.chat.id)) {
      console.warn(`Ignore request from ${message.chat.id}!`);

      bot.sendMessage(message.chat.id, 'Unauthorized user.');
    } else {
      bot.sendMessage(message.chat.id, `Use ${environment.botUsername} <location>`);
    }
  }

  async function handleInlineQuery(message) {
    console.log('Handling inline query...');
    console.log(message);

    if (message.query.length === 0 || !authorizedUsers.includes(message.from.id)) {
      console.warn(`Ignore request from ${message.from.id}!`);
      return;
    }

    try {
      userToChatMap.set(message.from.id, message.chat.id);
      const cities = await getCitySuggestions(message.query);
      bot.answerInlineQuery(message.id, cities, {
        cache_time: queryCacheTime,
        is_personal: false,
      });
    } catch (e) {
      console.error('Error getting city suggestions.', e);
    }
  }

  async function handleMessage(message) {
    if (message.via_bot && message.via_bot.id === botId) {
      console.log('Handling message...');
      console.log(message);
      // Hacky way to get chat ID in `chosen_inline_result`
      // We're assuming that on('message') is called before on('chosen_inline_result')
      userToChatMap.set(message.from.id, message.chat.id);
    }
  }

  async function handleChosenInlineResult(result) {
    console.log('Handling chosen inline result...');
    console.log(result);
    const chatID = userToChatMap.get(result.from.id);

    if (chatID === undefined) {
      // `chosen_inline_result` was called before `message` :(
      console.error('No chat ID for this inline query.');
      return;
    }

    userToChatMap.delete(result.from.id);

    try {
      const location = await getLocationInfo(result.result_id);
      const { current, today } = await getWeather(location);

      const message = formattedMessage(location, current, today);
      await bot.sendMessage(chatID, message, { parse_mode: 'HTML' });
    } catch (e) {
      console.error('Error getting weather data.', e);
    }
  }
}

export default weatherBot;
