# weather-bot-telegram

A weather bot for Telegram built using [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api). Features inline queries for autocompleting city names. Remix for personal use.

City autocomplete results from [Teleport](https://developers.teleport.org/api/).

Weather data from [OpenWeatherMap](https://openweathermap.org/).

---

### server.js

> Contains server code

### bot.js

> Contains bot code

### .env

> Environmental variables

- TELEGRAM_TOKEN - Telegram bot token

- AUTHORIZED_USERS - Telegram user ids separated by comma; ex. `'1234,5678,4321'`

- OWM_API_KEY - API Key from OpenWeatherMap

- NTBA_FIX_319=1
