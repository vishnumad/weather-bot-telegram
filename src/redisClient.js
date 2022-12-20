import { createClient } from 'redis';
import getEnv from './environment';

const create = () => {
  let client;

  const environment = getEnv();

  if (environment.nodeEnv === 'production') {
    client = createClient({
      url: environment.redisUrl,
      password: environment.redisPassword,
    });
  } else {
    client = createClient();
  }

  client.on('error', (error) => {
    console.error(error);
  });

  client.connect();

  return client;
};

export default create;
