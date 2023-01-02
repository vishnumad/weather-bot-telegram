import { createClient } from 'redis';
import getEnv from '../utils/environment';

type IRedisClient = ReturnType<typeof createClient>;

const create = (): IRedisClient => {
  let client: IRedisClient;

  const environment = getEnv();

  if (environment.nodeEnv === 'production') {
    client = createClient({
      url: environment.redisUrl,
      password: environment.redisPassword,
    });
  } else {
    client = createClient();
  }

  client.on('error', (error: Error) => {
    console.error(error);
  });

  client.connect();

  return client;
};

export default {
  create,
};
