/* eslint-disable import/prefer-default-export */

const getUserIdRedisKey = (userId: number | string): string =>
  `telegram-weather-bot-user-id-${userId}`;

export { getUserIdRedisKey };
