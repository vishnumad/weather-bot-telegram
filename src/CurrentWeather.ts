const sampleResponse = {
  lat: 1.2864,
  lon: 103.8539,
  timezone: 'Asia/Singapore',
  timezone_offset: 28800,
  current: {
    dt: 1672591462,
    sunrise: 1672614402,
    sunset: 1672657773,
    temp: 298.89,
    feels_like: 299.66,
    pressure: 1013,
    humidity: 82,
    dew_point: 295.58,
    uvi: 0,
    clouds: 75,
    visibility: 10000,
    wind_speed: 3.09,
    wind_deg: 340,
    weather: [
      {
        id: 803,
        main: 'Clouds',
        description: 'broken clouds',
        icon: '04n',
      },
    ],
  },
  minutely: [
    {
      dt: 1672591500,
      precipitation: 0,
    },
  ],
  hourly: [
    {
      dt: 1672588800,
      temp: 298.85,
      feels_like: 299.64,
      pressure: 1013,
      humidity: 83,
      dew_point: 295.74,
      uvi: 0,
      clouds: 80,
      visibility: 10000,
      wind_speed: 5.1,
      wind_deg: 20,
      wind_gust: 8.47,
      weather: [
        {
          id: 803,
          main: 'Clouds',
          description: 'broken clouds',
          icon: '04n',
        },
      ],
      pop: 0.07,
    },
  ],
  daily: [
    {
      dt: 1672635600,
      sunrise: 1672614402,
      sunset: 1672657773,
      moonrise: 1672644420,
      moonset: 1672599960,
      moon_phase: 0.35,
      temp: {
        day: 302.16,
        min: 297.7,
        max: 302.79,
        night: 298.98,
        eve: 300.58,
        morn: 297.7,
      },
      feels_like: {
        day: 305.36,
        night: 299.79,
        eve: 303.4,
        morn: 298.46,
      },
      pressure: 1012,
      humidity: 67,
      dew_point: 295.41,
      wind_speed: 5.69,
      wind_deg: 355,
      wind_gust: 9.53,
      weather: [
        {
          id: 500,
          main: 'Rain',
          description: 'light rain',
          icon: '10d',
        },
      ],
      clouds: 86,
      pop: 0.39,
      rain: 0.45,
      uvi: 0,
    },
  ],
};

type CurrentWeather = typeof sampleResponse;

export default CurrentWeather;
