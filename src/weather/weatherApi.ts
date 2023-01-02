import fetch from '../fetch';
import getEnv from '../utils/environment';
import { CurrentWeather } from './types';

function getApiUrl(latitude: number, longitude: number) {
  const url = new URL('https://api.openweathermap.org/data/2.5/onecall');
  url.searchParams.set('appid', getEnv().openWeatherMapApiKey ?? '');
  url.searchParams.set('lat', latitude.toString());
  url.searchParams.set('lon', longitude.toString());
  return url;
}

type GetWeatherArguments = {
  latitude: number;
  longitude: number;
};

export async function getWeather({ latitude, longitude }: GetWeatherArguments) {
  const url = getApiUrl(latitude, longitude).toString();
  const jsonResult = await fetch.get<CurrentWeather>(url);

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
export function kToF(k: number, precision = 0): number {
  return round(((k - 273.15) * 9) / 5 + 32, precision);
}

// Kelvin to Celsius
export function kToC(k: number, precision = 0): number {
  return round(k - 273.15, precision);
}

// m/s to mph
export function msToMph(speed: number, precision = 0): number {
  // speed * seconds per hour / meters per mile
  return round((speed * 3600) / 1609.34, precision);
}

// m/s to kmh
export function msToKmh(speed: number, precision = 0): number {
  // speed * seconds per hour / meters per km
  return round((speed * 3600) / 1000, precision);
}

// https://stackoverflow.com/a/47151941/2649697
function round(value: number, precision: number): number {
  if (Number.isInteger(precision)) {
    const shift = 10 ** precision;
    return Math.round(value * shift) / shift;
  }
  return Math.round(value);
}
