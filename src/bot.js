import TelegramBot from 'node-telegram-bot-api';
import { getAddressInfo } from './geo';
import { getWeather } from './weather';
import { formattedMessage } from './formatting';
import getEnv from './environment';
import redisClient from './redisClient';
import { getUserIdRedisKey } from './utils';

function weatherBot() {
  console.info('Starting Das Wetter Bot!');

  const environment = getEnv();

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

  const redis = redisClient();

  if (environment.nodeEnv === 'production') {
    bot.setWebHook(`${environment.appUrl}/bot${environment.telegramToken}`);
  }

  console.info('Web hook / polling configured...');

  bot.onText(/\/ping/, handlePing);
  bot.onText(/\/start/, handleStart);
  bot.onText(/\/help/, handleHelp);
  bot.onText(/\/w$/, handleWeather);
  bot.onText(/\/wo/, handleWeatherForOtherLocation);
  bot.onText(/\/setlocation/, handleSetLocation);
  bot.onText(/\/deletelocation/, handleDeleteLocation);

  function handlePing(message) {
    console.info(`Processing ping command for ${message.chat.id}`);

    bot.sendMessage(message.chat.id, 'This server is better than HWS! 🤯');
  }

  function handleStart(message) {
    if (!authorizedUsers.includes(message.chat.id)) {
      console.warn(`Ignore start request from ${message.chat.id}!`);

      bot.sendMessage(message.chat.id, 'Unauthorized user.');
    } else {
      bot.sendMessage(
        message.chat.id,
        `Use /help${environment.botUsername} for information on how to use this bot.`
      );
    }
  }

  function handleHelp(message) {
    if (!authorizedUsers.includes(message.chat.id)) {
      console.warn(`Ignore help request from ${message.chat.id}!`);

      bot.sendMessage(message.chat.id, 'Unauthorized user.');

      return;
    }

    const helpMessage = `I can give you the weather information given a location. You can control me by sending these commands:

/ping - check if I am alive
/w - get weather for your default location set
/wo {location} - get weather for a different location

<strong>Default Location</strong>
/setlocation {location} - set a default location
/deletelocation - delete your default location`;

    bot.sendMessage(message.chat.id, helpMessage, {
      parse_mode: 'HTML',
    });
  }

  async function handleWeather(message) {
    if (!authorizedUsers.includes(message.chat.id)) {
      console.warn(`Ignore weather request from ${message.chat.id}!`);

      bot.sendMessage(message.chat.id, 'Unauthorized user.');
    }

    try {
      const userId = message.from.id;
      const userIdRedisKey = getUserIdRedisKey(userId);
      const address = await redis.get(userIdRedisKey);

      if (address == null) {
        bot.sendMessage(
          message.chat.id,
          `Please set a default location using /setlocation${environment.botUsername}.`
        );

        return;
      }

      const addressObject = JSON.parse(address);

      const { current, today } = await getWeather({
        latitude: addressObject.geometry.lat,
        longitude: addressObject.geometry.lng,
      });

      const reply = formattedMessage(addressObject.formattedName, current, today);

      bot.sendMessage(message.chat.id, reply, { parse_mode: 'HTML' });
    } catch (error) {
      bot.sendMessage(message.chat.id, `Unable to get current weather for your default loation.`);
    }
  }

  async function handleWeatherForOtherLocation(message) {
    if (!authorizedUsers.includes(message.chat.id)) {
      console.warn(`Ignore weather request from ${message.chat.id}!`);

      bot.sendMessage(message.chat.id, 'Unauthorized user.');
    }

    const input = message.text
      ?.replace('/wo', '')
      .replace(`/wo${environment.botUsername}`, '')
      .trim();

    if (input.length < 1) {
      bot.sendMessage(message.chat.id, 'Please enter a location.');
      return;
    }

    try {
      const address = await getAddressInfo(input);

      console.log(address);

      const { current, today } = await getWeather({
        latitude: address.geometry.lat,
        longitude: address.geometry.lng,
      });

      const reply = formattedMessage(address.formattedName, current, today);

      bot.sendMessage(message.chat.id, reply, { parse_mode: 'HTML' });
    } catch (error) {
      bot.sendMessage(message.chat.id, `Unable to find a valid address for ${input}`);
    }
  }

  async function handleSetLocation(message) {
    if (!authorizedUsers.includes(message.chat.id)) {
      console.warn(`Ignore set location from ${message.chat.id}!`);

      bot.sendMessage(message.chat.id, 'Unauthorized user.');
    }

    const chatId = message.chat.id;
    const userId = message.from.id;

    const input = message.text
      ?.replace('/setlocation', '')
      .replace(`/setlocation${environment.botUsername}`, '')
      .trim();

    if (input.length < 1) {
      bot.sendMessage(message.chat.id, 'Please enter a location.');
      return;
    }

    try {
      const address = await getAddressInfo(input);
      const userIdRedisKey = getUserIdRedisKey(userId);

      await redis.set(userIdRedisKey, JSON.stringify(address));

      bot.sendMessage(chatId, `Default location ${address.formattedName} set.`, {
        reply_to_message_id: message.message_id,
      });
    } catch (error) {
      bot.sendMessage(chatId, `Unable to find a valid address for ${input}`);
    }
  }

  async function handleDeleteLocation(message) {
    if (!authorizedUsers.includes(message.chat.id)) {
      console.warn(`Ignore set location from ${message.chat.id}!`);

      bot.sendMessage(message.chat.id, 'Unauthorized user.');
    }

    const chatId = message.chat.id;
    const userId = message.from.id;
    const userRedisKey = getUserIdRedisKey(userId);

    const addressSaved = await redis.get(userRedisKey);

    if (addressSaved == null) {
      bot.sendMessage(chatId, `No default location to delete.`, {
        reply_to_message_id: message.message_id,
      });

      return;
    }

    await redis.del(userRedisKey);

    const locationDeleted = JSON.parse(addressSaved).formattedName;

    bot.sendMessage(chatId, `Default location ${locationDeleted} deleted.`, {
      reply_to_message_id: message.message_id,
    });
  }
}

export default weatherBot;
