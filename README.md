# Telegram Weather Bot

*A fork from [vishnumad/weather-bot-telegram](https://github.com/vishnumad/weather-bot-telegram)*

[![Build Docker image and deploy to GKE](https://github.com/lwschan/telegram-weather-bot/actions/workflows/build-deploy-gke.yml/badge.svg)](https://github.com/lwschan/telegram-weather-bot/actions/workflows/build-deploy-gke.yml)

A weather bot for Telegram built using:

- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api).
- City autocomplete results from [Teleport](https://developers.teleport.org/api/).
- Weather data from [OpenWeatherMap](https://openweathermap.org/).

## Node version

If you wish to modify the NodeJs version, you need go change it in `.nvmrc`.

## .env configurations

```shell
NTBA_FIX_319=1

# Telegram bot token
TELEGRAM_TOKEN='1234567890:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA-A1A'

# Authorized telegram user id's separated by comma ex. 1234,5678,4321
AUTHORIZED_USERS='123456678,098765432,67890123'

# Open Weather API Key
OWM_API_KEY='1234qwertyuiopasdfghjklzxcvbnm12'

# Telegram bot username
BOT_USERNAME='@the-weather-bot'
```
