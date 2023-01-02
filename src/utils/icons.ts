// Icons from wego - https://github.com/schachmat/wego/

// prettier-ignore
const icons = {
  unknown: [''],
  cloudy: [
    '     .--.    ',
    '  .-(    ).  ',
    ' (___.__)__) ',
  ],
  fog: [
    ' _ - _ - _ - ',
    '  _ - _ - _  ',
    ' _ - _ - _ - ',
  ],
  heavyRain: [
    '     .-.     ',
    '    (   ).   ',
    '   (___(__)  ',
    '  ‚ʻ‚ʻ‚ʻ‚ʻ   ',
    '  ‚ʻ‚ʻ‚ʻ‚ʻ   ',
  ],
  heavyShowers: [
    ' _`/"".-.    ',
    '  ,\\_(   ).  ',
    '   /(___(__) ',
    '   ‚ʻ‚ʻ‚ʻ‚ʻ  ',
    '   ‚ʻ‚ʻ‚ʻ‚ʻ  ',
  ],
  heavySnow: [
    '     .-.     ',
    '    (   ).   ',
    '   (___(__)  ',
    '   * * * *   ',
    '  * * * *    ',
  ],
  heavySnowShowers: [
    ' _`/"".-.    ',
    '  ,\\_(   ).  ',
    '   /(___(__) ',
    '    * * * *  ',
    '   * * * *   ',
  ],
  lightRain: [
    '     .-.     ',
    '    (   ).   ',
    '   (___(__)  ',
    '    ʻ ʻ ʻ ʻ  ',
    '   ʻ ʻ ʻ ʻ   ',
  ],
  lightShowers: [
    ' _`/"".-.    ',
    '  ,\\_(   ).  ',
    '   /(___(__) ',
    '     ʻ ʻ ʻ ʻ ',
    '    ʻ ʻ ʻ ʻ  ',
  ],
  lightSleet: [
    '     .-.     ',
    '    (   ).   ',
    '   (___(__)  ',
    '    ʻ * ʻ *  ',
    '   * ʻ * ʻ   ',
  ],
  lightSleetShowers: [
    ' _`/"".-.    ',
    '  ,\\_(   ).  ',
    '   /(___(__) ',
    '     ʻ * ʻ * ',
    '    * ʻ * ʻ  ',
  ],
  lightSnow: [
    '     .-.     ',
    '    (   ).   ',
    '   (___(__)  ',
    '    *  *  *  ',
    '   *  *  *   ',
  ],
  lightSnowShowers: [
    ' _`/"".-.    ',
    '  ,\\_(   ).  ',
    '   /(___(__) ',
    '     *  *  * ',
    '    *  *  *  ',
  ],
  partlyCloudy: [
    '   \\  /      ',
    ' _ /"".-.    ',
    '   \\_(   ).  ',
    '   /(___(__) ',
  ],
  sunny: [
    '    \\   /    ',
    '     .-.     ',
    '  ‒ (   ) ‒  ',
    '     `-᾿     ',
    '    /   \\    ',
  ],
  thunderyHeavyRain: [
    '     .-.     ',
    '    (   ).   ',
    '   (___(__)  ',
    '  ‚ʻ⚡ʻ‚⚡‚ʻ   ',
    '  ‚ʻ‚ʻ⚡ʻ‚ʻ   ',
  ],
  thunderyShowers: [
    ' _`/"".-.    ',
    '  ,\\_(   ).  ',
    '   /(___(__) ',
    '    ⚡ʻ ʻ⚡ʻ ʻ ',
    '    ʻ ʻ ʻ ʻ  ',
  ],
  thunderySnowShowers: [
    ' _`/"".-.    ',
    '  ,\\_(   ).  ',
    '   /(___(__) ',
    '     *⚡ *⚡ * ',
    '    *  *  *  ',
  ],
  veryCloudy: [
    '     .--.    ',
    '  .-(    ).  ',
    ' (___.__)__) ',
  ],
};

const codeToIconRecord: Record<number, string[]> = {
  200: icons.thunderyShowers,
  201: icons.thunderyShowers,
  210: icons.thunderyShowers,
  230: icons.thunderyShowers,
  231: icons.thunderyShowers,
  202: icons.thunderyHeavyRain,
  211: icons.thunderyHeavyRain,
  212: icons.thunderyHeavyRain,
  221: icons.thunderyHeavyRain,
  232: icons.thunderyHeavyRain,
  300: icons.lightRain,
  301: icons.lightRain,
  310: icons.lightRain,
  311: icons.lightRain,
  313: icons.lightRain,
  321: icons.lightRain,
  302: icons.heavyRain,
  312: icons.heavyRain,
  314: icons.heavyRain,
  500: icons.lightShowers,
  501: icons.lightShowers,
  502: icons.heavyShowers,
  503: icons.heavyShowers,
  504: icons.heavyShowers,
  511: icons.lightSleet,
  520: icons.lightShowers,
  521: icons.lightShowers,
  522: icons.heavyShowers,
  531: icons.heavyShowers,
  600: icons.lightSnow,
  601: icons.lightSnow,
  602: icons.heavySnow,
  611: icons.lightSleet,
  612: icons.lightSleetShowers,
  615: icons.lightSleet,
  616: icons.lightSleet,
  620: icons.lightSnowShowers,
  621: icons.lightSnowShowers,
  622: icons.heavySnowShowers,
  701: icons.fog,
  711: icons.fog,
  721: icons.fog,
  741: icons.fog,
  731: icons.unknown, // sand, dust whirls
  751: icons.fog, // sand
  761: icons.fog, // dust
  762: icons.fog, // volcanic ash
  771: icons.unknown, // squalls
  781: icons.unknown, // tornado
  800: icons.sunny,
  801: icons.partlyCloudy,
  802: icons.cloudy,
  803: icons.veryCloudy,
  804: icons.veryCloudy,
  900: icons.unknown, // tornado
  901: icons.unknown, // tropical storm
  902: icons.unknown, // hurricane
  903: icons.unknown, // cold
  904: icons.unknown, // hot
  905: icons.unknown, // windy
  906: icons.unknown, // hail
  951: icons.unknown, // calm
  952: icons.unknown, // light breeze
  953: icons.unknown, // gentle breeze
  954: icons.unknown, // moderate breeze
  955: icons.unknown, // fresh breeze
  956: icons.unknown, // strong breeze
  957: icons.unknown, // high wind, near gale
  958: icons.unknown, // gale
  959: icons.unknown, // severe gale
  960: icons.unknown, // storm
  961: icons.unknown, // violent storm
  962: icons.unknown, // hurricane
};

const windIcons = ['⭡', '⭧', '⭢', '⭨', '⭣', '⭩', '⭠', '⭦', '⭡'];

const getWeatherIcon = (code: number): string[] => {
  return codeToIconRecord[code] ?? icons.unknown;
};

const getWindDirectionIcon = (degree: number): string => {
  const index = Math.round((degree % 360) / 45);
  return windIcons[index];
};

export { getWeatherIcon, getWindDirectionIcon };
