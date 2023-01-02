import { createClient } from 'redis';
import getEnv from '../utils/environment';

type IRedisClient = ReturnType<typeof createClient>;

const create = (): IRedisClient => {
  const environment = getEnv();

  const client: IRedisClient =
    environment.redisPassword != null
      ? createClient({
          url: environment.redisUrl,
          password: environment.redisPassword,
        })
      : createClient({
          url: environment.redisUrl,
        });

  client.on('error', (error: Error) => {
    console.error('Redis client encountered an error...');
    console.error(error);
  });

  client.connect();

  return client;
};

export default {
  create,
};
