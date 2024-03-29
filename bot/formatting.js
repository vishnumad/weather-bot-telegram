import { getWeatherIcon } from './icons.js';
import { kToF, kToC, msToMph, msToKmh } from './weather.js';
import table from 'text-table';

const BLANK = ' ';
const SEPARATOR = '────────────';

function pre(text) {
  return `<pre>${text}</pre>`;
}

function strong(text) {
  return `<strong>${text}</strong>`;
}

export function formattedMessage(location, current, today) {
  // Feels like
  const feelsLikeF = kToF(current.feels_like, 1);
  const feelsLikeC = kToC(current.feels_like, 1);

  // Current
  const currentF = kToF(current.temp, 1);
  const currentC = kToC(current.temp, 1);

  const windSpeedMph = msToMph(current.wind_speed);
  const windSpeedKmh = msToKmh(current.wind_speed);

  const currentInfoTable = table([
    ['Real feel', `${feelsLikeF}F`, `${feelsLikeC}C`],
    ['Wind', `${windSpeedMph}mph`, `${windSpeedKmh}kmh`],
    ['UV Index', current.uvi],
  ]);

  // High temp
  const hiF = kToF(today.temp_max, 0);
  const hiC = kToC(today.temp_max, 0);

  // Low temp
  const loF = kToF(today.temp_min, 0);
  const loC = kToC(today.temp_min, 0);

  const todaysWeatherTable = table(
    [
      ['High', `${hiF}F`, `${hiC}C`],
      ['Low', `${loF}F`, `${loC}C`],
    ],
    { align: ['l', 'r', 'r'] }
  );

  const rows = [
    location.city,
    BLANK,
    pre(getWeatherIcon(current.weather.code).join('\n')),
    BLANK,
    `${current.weather.main} – ${current.weather.description}`,
    strong(`${currentF}F  •  ${currentC}C`),
    BLANK,
    pre(currentInfoTable),
    pre(SEPARATOR),
    pre(todaysWeatherTable),
  ];

  return rows.join('\n');
}
