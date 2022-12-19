import fetch from 'node-fetch';

function getApiUrl(latitude, longitude) {
  const url = new URL('https://api.openweathermap.org/data/2.5/onecall');
  url.searchParams.set('appid', process.env.OWM_API_KEY);
  url.searchParams.set('lat', latitude);
  url.searchParams.set('lon', longitude);
  return url;
}

export async function getWeather({ latitude, longitude }) {
  const url = getApiUrl(latitude, longitude).toString();
  const jsonResult = await fetch(url).then((res) => res.json());

  const { current } = jsonResult;
  const today = jsonResult.daily[0];

  return {
    current: {
      time: current.dt,
      timezone_offset: jsonResult.timezone_offset,
      temp: current.temp,
      feels_like: current.feels_like,
      pressure: current.pressure,
      humidity: current.humidity,
      uvi: current.uvi,
      visibility: current.visibility,
      wind_speed: current.wind_speed,
      wind_deg: current.wind_deg,
      weather: {
        code: current.weather[0].id,
        main: current.weather[0].main,
        description: current.weather[0].description,
      },
    },
    today: {
      temp_min: today.temp.min,
      temp_max: today.temp.max,
      sunrise: today.sunrise,
      sunset: today.sunset,
      wind_gust: today.wind_gust,
      uvi: today.uvi,
    },
  };
}

// Kelvin to Fahrenheit
export function kToF(k, precision = 0) {
  return round(((k - 273.15) * 9) / 5 + 32, precision);
}

// Kelvin to Celsius
export function kToC(k, precision = 0) {
  return round(k - 273.15, precision);
}

// m/s to mph
export function msToMph(speed, precision = 0) {
  // speed * seconds per hour / meters per mile
  return round((speed * 3600) / 1609.34, precision);
}

// m/s to kmh
export function msToKmh(speed, precision = 0) {
  // speed * seconds per hour / meters per km
  return round((speed * 3600) / 1000, precision);
}

// https://stackoverflow.com/a/47151941/2649697
function round(value, precision) {
  if (Number.isInteger(precision)) {
    const shift = 10 ** precision;
    return Math.round(value * shift) / shift;
  }
  return Math.round(value);
}
