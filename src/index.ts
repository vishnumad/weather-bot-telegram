import {
  configureEnvVars,
  getEnvVars,
  isProduction,
  throwMissingEnvVarError,
} from './utils/environment';
import weatherBot from './weatherBot';
import TelegramBot from 'node-telegram-bot-api';

const setBotWebHook = (telegramBot: TelegramBot): void => {
  if (!isProduction()) {
    return;
  }

  const environment = getEnvVars();

  if (environment.appUrl == null) {
    throwMissingEnvVarError('APP_URL');
  }

  telegramBot.setWebHook(`${environment.appUrl}/bot${environment.telegramToken}`);

  console.info(`Configured webhook URL ${environment.appUrl} for telegram bot...`);
};

const initialize = async (): Promise<void> => {
  const environment = getEnvVars();

  const telegramBot = isProduction()
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

  setBotWebHook(telegramBot);

  weatherBot(telegramBot);
};

configureEnvVars();

initialize();
