import TelegramBot from 'node-telegram-bot-api';
import { getAddressInfo } from './geo';
import { getWeather } from './weather';
import { formattedMessage } from './formatting';
import getEnv from './environment';

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

  if (environment.nodeEnv === 'production') {
    bot.setWebHook(`${environment.appUrl}/bot${environment.telegramToken}`);
  }

  console.info('Web hook / polling configured...');

  bot.onText(/\/ping/, handlePing);
  bot.onText(/\/start/, handleStart);
  bot.onText(/\/help/, handleHelp);
  bot.onText(/\/weather/, handleWeather);

  function handlePing(message) {
    console.info(`Processing ping command for ${message.chat.id}`);

    bot.sendMessage(message.chat.id, 'This server is better than HWS! 🤯');
  }

  function handleStart(message) {
    if (!authorizedUsers.includes(message.chat.id)) {
      console.warn(`Ignore request from ${message.chat.id}!`);

      bot.sendMessage(message.chat.id, 'Unauthorized user.');
    } else {
      bot.sendMessage(message.chat.id, `Use /weather${environment.botUsername} <location> to get weather forecast`);
    }
  }

  function handleHelp(message) {
    if (!authorizedUsers.includes(message.chat.id)) {
      console.warn(`Ignore request from ${message.chat.id}!`);

      bot.sendMessage(message.chat.id, 'Unauthorized user.');
    } else {
      bot.sendMessage(message.chat.id, `Use /weather${environment.botUsername} <location> to get weather forecast`);
    }
  }

  async function handleWeather(message) {
    const input = message.text?.replace('/weather ', '').replace(`/weather${environment.botUsername} `, '');

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
}

export default weatherBot;
