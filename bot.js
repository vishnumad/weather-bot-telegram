const TelegramBot = require('node-telegram-bot-api');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const TOKEN = process.env.TELEGRAM_TOKEN;
const UNAUTHORIZED_ID = '-1';
const MAX_RESULTS = 8;

const bot = new TelegramBot(TOKEN);
const authUsers = process.env.AUTHORIZED_USERS.split(',').map(id => parseInt(id, 10));

function getCitySuggestions(search_term) {
    const url = `https://api.teleport.org/api/cities/?search=${search_term}`;
    const request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);

    if (request.status === 200) {
        const suggestions = JSON.parse(request.responseText)._embedded['city:search-results'];
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
        return cities;
    }
    return [];
}

function getWeather(city_id) {
    const url = `http://api.openweathermap.org/data/2.5/weather?id=${city_id}&appid=${process.env.OWM_APP_ID}`;
    const request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);

    if (request.status === 200) {
        const weather = JSON.parse(request.responseText);
        return {
            success: true,
            city: weather.name,
            temp: `${kelvinToF(weather.main.temp)}°F / ${kelvinToC(weather.main.temp)}°C`,
            condition: getWeatherCondition(weather.weather[0].id, weather.weather[0].description),
            min: `${kelvinToF(weather.main.temp_min)}°F / ${kelvinToC(weather.main.temp_min)}°C`,
            max: `${kelvinToF(weather.main.temp_max)}°F / ${kelvinToC(weather.main.temp_max)}°C`
        };
    }
    return {
        success: false
    }
}

function extractCityId(url) {
    const pattern = /([0-9])\w+/g;
    return pattern.exec(url)[0];
}

function kelvinToF(kelvin) {
    return round(1.8 * (kelvin - 273) + 32, 1);
}

function kelvinToC(kelvin) {
    return round(kelvin - 273, 1);
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

function getWeatherCondition(code, condition) {
    // Specific weather condition
    switch (code) {
        case 200:
        case 201:
        case 202:
        case 230:
        case 231:
        case 232:
            return `with a ${condition.replace('with', 'and')}`;
        case 520:
        case 521:
        case 522:
        case 531:
            return `with ${condition.replace('shower rain', 'rain showers')}`;
        case 620:
        case 621:
        case 622:
            return `with ${condition.replace('shower snow', 'snow showers')}`;
        case 731:
            return 'with sand and dust whirls';
        case 781:
            return 'with tornadoes';
        case 800:
            return 'with clear skies';
    }
    // General thunderstorm
    if (code >= 200 && code < 300) return `with a ${condition}`;
    // General weather condition
    return `with ${condition}`;
}

bot.setWebHook(`https://${process.env.PROJECT_NAME}.glitch.me/bot${TOKEN}`);

bot.onText(/\/ping/, msg => {
    bot.sendMessage(msg.chat.id, 'It\'s stuffy in this server! 😓');
});

bot.onText(/\/start/, msg => {
    if (msg.chat.id == process.env.GROUP_CHAT_ID) {
        bot.sendMessage(msg.chat.id, 'Use @tenki_bot <location>');
    } else {
        console.log(`Leaving chat: ${msg.chat.id}`);
        bot.leaveChat(msg.chat.id);
    }
});

bot.onText(/\/help/, msg => {
    bot.sendMessage(msg.chat.id, 'Use @tenki_bot <location>');
});

bot.on('inline_query', query => {
    if (authUsers.includes(query.from.id)) {
        if (query.query.length >= 3) {
            const cities = getCitySuggestions(query.query);
            if (cities.length > 0) bot.answerInlineQuery(query.id, cities);
        }
    } else {
        bot.answerInlineQuery(query.id, [{
            id: UNAUTHORIZED_ID,
            type: 'article',
            title: 'Unauthorized user',
            message_text: `Remix the project for your personal use: https://glitch.com/~${process.env.PROJECT_NAME}`
        }]);
    }
});

bot.on('chosen_inline_result', query => {
    if (query.result_id !== UNAUTHORIZED_ID) {
        const { success, city, temp, condition, min, max } = getWeather(query.result_id);
        if (success) {
            bot.sendMessage(process.env.GROUP_CHAT_ID, `It's ${temp} in ${city} ${condition}. The high is ${max} and the low is ${min}.`);
        }
    }
});

bot.URL = `/bot${TOKEN}`;

module.exports = bot;
