/* eslint-disable import/prefer-default-export */

const getUserIdRedisKey = (userId) => `telegram-weather-bot-user-id-${userId}`;

export { getUserIdRedisKey };
