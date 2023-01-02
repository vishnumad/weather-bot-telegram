import dotenv from 'dotenv';

const configure = () => dotenv.config();

type Environment = {
  nodeEnv: string;
  telegramToken: string | undefined;
  authorizedUsers: string | undefined;
  openWeatherMapApiKey: string | undefined;
  botUsername: string | undefined;
  googleMapsApiKey: string | undefined;
  appUrl: string | undefined;
  redisUrl: string | undefined;
  redisPassword: string | undefined;
};

const get = (): Environment => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  telegramToken: process.env.TELEGRAM_TOKEN,
  authorizedUsers: process.env.AUTHORIZED_USERS,
  openWeatherMapApiKey: process.env.OWM_API_KEY,
  botUsername: process.env.BOT_USERNAME,
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  appUrl: process.env.APP_URL,
  redisUrl: process.env.REDIS_URL,
  redisPassword: process.env.REDIS_PASSWORD,
});

export { configure, get };

export default get;
