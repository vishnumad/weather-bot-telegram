import TelegramBot from 'node-telegram-bot-api';
import { getLocationInfo, getCitySuggestions } from './geo.js';
import { getWeather } from './weather.js';
import { formattedMessage } from './formatting.js';

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
const BOT_ID = Number(BOT_TOKEN.split(':')[0]);
const QUERY_CACHE_TIME = 7 * 60 * 60 * 24; // 7 days

const AUTHORIZED_USERS = process.env.AUTHORIZED_USERS.split(',').map((id) => parseInt(id));

const userToChatMap = new Map();
const bot = new TelegramBot(
  BOT_TOKEN,
  {
    polling: false,
    filepath: false,
    webHook: {
      port: 443,
      host: "0.0.0.0"
    }
  });

bot.setWebHook(`${process.env.APP_URL}/bot${process.env.TELEGRAM_TOKEN}`)

bot.onText(/\/ping/, (message) => {
  bot.sendMessage(message.chat.id, "It's stuffy in this server! 😓");
});

bot.onText(/\/start/, (message) => {
  if (!AUTHORIZED_USERS.includes(message.from.id)) {
    bot.sendMessage(message.chat.id, 'Unauthorized user');
  } else {
    bot.sendMessage(message.chat.id, 'Use @tenki_bot <location>');
  }
});

bot.onText(/\/help/, (message) => {
  if (!AUTHORIZED_USERS.includes(message.from.id)) {
    bot.sendMessage(message.chat.id, 'Unauthorized user');
  } else {
    bot.sendMessage(message.chat.id, 'Use @tenki_bot <location>');
  }
});

bot.onText(/\/help/, (message) => {
  // TODO: Add support for getting weather with `/weather <location>`
});

bot.on('inline_query', async (message) => {
  if (message.query.length === 0) return;
  if (!AUTHORIZED_USERS.includes(message.from.id)) return;

  try {
    const cities = await getCitySuggestions(message.query);
    bot.answerInlineQuery(message.id, cities, {
      cache_time: QUERY_CACHE_TIME,
      is_personal: false,
    });
  } catch (e) {
    console.error('Error getting city suggestions', e);
  }
});

bot.on('message', async (message) => {
  if (message.via_bot && message.via_bot.id === BOT_ID) {
    // Hacky way to get chat ID in `chosen_inline_result`
    // We're assuming that on('message') is called before on('chosen_inline_result')
    userToChatMap.set(message.from.id, message.chat.id);
  }
});

bot.on('chosen_inline_result', async (result) => {
  if (!AUTHORIZED_USERS.includes(result.from.id)) return;

  const chatID = userToChatMap.get(result.from.id);
  if (chatID === undefined) {
    // `chosen_inline_result` was called before `message` :(
    console.error('No chat ID for this inline query');
    return;
  }

  userToChatMap.delete(result.from.id);

  try {
    const location = await getLocationInfo(result.result_id);
    const { current, today } = await getWeather(location);

    const message = formattedMessage(location, current, today);
    await bot.sendMessage(chatID, message, { parse_mode: 'HTML' });
  } catch (e) {
    console.error('Error getting weather data', e);
  }
});
