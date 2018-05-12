@tenki_bot
==========================

A weather bot for Telegram built using [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api).  Features inline queries for autocompleting city names. Remix for personal use.

City autocomplete results from [Teleport](https://developers.teleport.org/api/).

Weather data from [OpenWeatherMap](https://openweathermap.org/api).


# .env variables

`TELEGRAM_TOKEN` - Telegram bot token

`GROUP_CHAT_ID` - Id of group chat to post weather in; ex. `-123456789`

`AUTHORIZED_USERS` - Telegram user ids separated by comma; ex. `'1234,5678,4321'`

`OWM_APP_ID` - OpenWeatherMap App Id