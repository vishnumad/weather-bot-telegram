const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('.data/db.json');
const db = low(adapter);

const TOKEN = process.env.TELEGRAM_TOKEN;
const UNAUTHORIZED_ID = '-1';
const MAX_RESULTS = 8;

const UNAUTHORIZED_ANSWER = {
  id: UNAUTHORIZED_ID,
  type: 'article',
  title: 'Unauthorized user',
  message_text: `Remix the project for your personal use: https://glitch.com/~${process.env.PROJECT_NAME}`
};

const bot = new TelegramBot(TOKEN);
const authorizedUsers = process.env.AUTHORIZED_USERS.split(',').map(id => parseInt(id, 10));

function fetchCitySuggestions(query) {
  return fetch(`https://api.teleport.org/api/cities/?search=${query}`)
    .then(status)
    .then(asJson)
    .then(response => {
      const suggestions = response._embedded['city:search-results'];
      let cities = [];
    
      let max = suggestions.length;
      if (max > MAX_RESULTS) max = MAX_RESULTS;
    
      for (let i = 0; i < max; i++) {
        const cityId = "" + extractCityId(suggestions[i]._links['city:item'].href);
        cities.push({
          id: cityId,
          type: 'article',
          title: suggestions[i].matching_full_name,
          message_text: `Weather: ${suggestions[i].matching_full_name}`
        });
      }
    
      return Promise.resolve(cities);
    });
}

function fetchCityInfo(id) {
  const dbLoc = db.get('locations')
    .find({ id: id })
    .value();
  
  if (dbLoc == null) {
    // No saved values, fetch from API
    return fetch(`https://api.teleport.org/api/cities/geonameid:${id}/`)
      .then(status)
      .then(asJson)
      .then(response => {
        const location = {
          city: response.full_name,
          latitude: response.location.latlon.latitude,
          longitude: response.location.latlon.longitude
        }
        
        // Save to database
        db.get('locations')
          .push({ id: id, cityInfo: location })
          .write();
      
        console.log(`Saved to databse: id=${id}, city=${location.city}, latitude=${location.latitude}, longitude=${location.longitude}`);
        
        return Promise.resolve(location);
      });
  } else {
    // City info in databse so we can use that
    return Promise.resolve(dbLoc.cityInfo);
  }
}

function fetchWeatherInfo(cityInfo) {
  return fetch(`https://api.darksky.net/forecast/${process.env.DARK_SKY_KEY}/${cityInfo.latitude},${cityInfo.longitude}`)
    .then(status)
    .then(asJson)
    .then(weather => {
      return Promise.resolve({
        city: cityInfo.city,
        temperature: `${weather.currently.temperature}°F (${convertFtoC(weather.currently.temperature)}°C)`,
        summary: weather.currently.summary,
        feelsLike: `${weather.currently.apparentTemperature}°F (${convertFtoC(weather.currently.apparentTemperature)}°C)`,
        hi: `${weather.daily.data[0].temperatureHigh}°F (${convertFtoC(weather.daily.data[0].temperatureHigh)}°C)`,
        lo: `${weather.daily.data[0].temperatureLow}°F (${convertFtoC(weather.daily.data[0].temperatureLow)}°C)`
      });
    });
}

function asJson(response) {
  return response.json();
}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function extractCityId(url) {
  const pattern = /([0-9])\w+/g;
  return pattern.exec(url)[0];
}

function convertFtoC(temp) {
  return round((temp - 32) * (5 / 9), 1)
}

// https://stackoverflow.com/a/47151941/2649697
function round(value, precision) {
  if (Number.isInteger(precision)) {
    const shift = 10 ** precision;
    return Math.round(value * shift) / shift;
  } else {
    return Math.round(value);
  }
}

db.defaults({ locations: [] }).write()

bot.setWebHook(`https://${process.env.PROJECT_NAME}.glitch.me/bot${TOKEN}`);

bot.onText(/\/ping/, message => {
  bot.sendMessage(message.chat.id, 'It\'s stuffy in this server! 😓');
});

bot.onText(/\/start/, message => {
  if (authorizedUsers.contains(message.from.id) && message.chat.id == process.env.GROUP_CHAT_ID) {
    bot.sendMessage(message.chat.id, 'Use @tenki_bot <location>');
  } else {
    bot.sendMessage('Unauthorized user/chat');
    if (message.chat.id < 0)
      bot.leaveChat(message.chat.id);
  }
});

bot.onText(/\/help/, message => {
  bot.sendMessage(message.chat.id, 'Use @tenki_bot <location>');
});

bot.on('inline_query', query => {
  
  if (!authorizedUsers.includes(query.from.id)) {
    bot.answerInlineQuery(query.id, [UNAUTHORIZED_ANSWER]);
    return;
  }
  if (query.query.length < 3) return;
  
  // Fetch city autocomplete suggestions
  fetchCitySuggestions(query.query)
    .then(cities => {
      bot.answerInlineQuery(query.id, cities);
    })
    .catch(error => {
      console.log(error);
    });
});

bot.on('chosen_inline_result', result => {
  if (result.result_id === UNAUTHORIZED_ID) return;
  
  // Fetch the weather data for given city
  fetchCityInfo(result.result_id)
    .then(cityInfo => fetchWeatherInfo(cityInfo))
    .then(weatherInfo => {
      const message = `${weatherInfo.city}\n\n${weatherInfo.summary}\n${weatherInfo.temperature}\n\nFeels Like: ${weatherInfo.feelsLike}\nHigh: ${weatherInfo.hi}\nLow: ${weatherInfo.lo}`;
      bot.sendMessage(process.env.GROUP_CHAT_ID, message);
    })
    .catch(error => {
      console.log(error);
    });
});

bot.URL = `/bot${TOKEN}`;

module.exports = bot;
