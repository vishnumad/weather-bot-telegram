import dotenv from 'dotenv';

const configure = () => dotenv.config();

const get = () => ({
  nodeEnv: process.env.NODE_ENV,
  telegramToken: process.env.TELEGRAM_TOKEN,
  authorizedUsers: process.env.AUTHORIZED_USERS,
  openWeatherMapApiKey: process.env.OWM_API_KEY,
  botUsername: process.env.BOT_USERNAME,
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  appUrl: process.env.APP_URL,
});

export { configure, get };

export default get;
