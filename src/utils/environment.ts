import dotenv from 'dotenv';

type Environment = {
  nodeEnv: string;
  telegramToken: string;
  authorizedUsers: string;
  openWeatherMapApiKey: string;
  botUsername: string;
  googleMapsApiKey: string;
  appUrl: string | undefined;
  redisUrl: string;
  redisPassword: string | undefined;
};

const throwMissingEnvVarError = (envVarName: string): never => {
  throw new Error(`Environment Error: Variable ${envVarName} is not set.`);
};

const getEnvVars = (): Environment => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  telegramToken: process.env.TELEGRAM_TOKEN ?? throwMissingEnvVarError('TELEGRAM_TOKEN'),
  authorizedUsers: process.env.AUTHORIZED_USERS ?? throwMissingEnvVarError('AUTHORIZED_USERS'),
  openWeatherMapApiKey: process.env.OWM_API_KEY ?? throwMissingEnvVarError('OWM_API_KEY'),
  botUsername: process.env.BOT_USERNAME ?? throwMissingEnvVarError('BOT_USERNAME'),
  googleMapsApiKey:
    process.env.GOOGLE_MAPS_API_KEY ?? throwMissingEnvVarError('GOOGLE_MAPS_API_KEY'),
  appUrl: process.env.APP_URL,
  redisUrl: process.env.REDIS_URL ?? throwMissingEnvVarError('REDIS_URL'),
  redisPassword: process.env.REDIS_PASSWORD,
});

const isProduction = (): boolean => getEnvVars().nodeEnv === 'production';

const configureEnvVars = () => dotenv.config();

export { configureEnvVars, getEnvVars, isProduction, throwMissingEnvVarError };

export default getEnvVars;
