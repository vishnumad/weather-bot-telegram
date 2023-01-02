# Telegram Weather Bot

*A fork from [vishnumad/weather-bot-telegram](https://github.com/vishnumad/weather-bot-telegram)*

[![Build Docker image and deploy to GKE](https://github.com/lwschan/telegram-weather-bot/actions/workflows/build-deploy-gke.yml/badge.svg)](https://github.com/lwschan/telegram-weather-bot/actions/workflows/build-deploy-gke.yml)

A weather bot for Telegram built using:

- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
- Geocode address based on input from [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding)
- Weather data from [OpenWeatherMap](https://openweathermap.org/)

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

# Google Maps API key
GOOGLE_MAPS_API_KEY='1235asdasd'

# Redis
REDIS_URL='redis://something.service.local:6379'
REDIS_PASSWORD='somepassword'
```

## Local development

To run this bot on your localhost, you need to have redis installed and exposed via the default port of 6379.

If you do not have one installed, you can run one using Docker.

```shell
# Without GNU Make
> docker pull redis

> docker run --rm --name local-redis -p 6379:6379 -d redis

# With GNU Make
> make pull-redis

> make start-redis
```
