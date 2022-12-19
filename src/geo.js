/* eslint-disable dot-notation */
import fetch from 'node-fetch';

export async function getCitySuggestions(query) {
  const url = `https://api.teleport.org/api/cities/?search=${query}&limit=8`;
  const res = await fetch(url).then((r) => r.json());
  const suggestions = res['_embedded']['city:search-results'];

  return suggestions.map((suggestion) => {
    return {
      id: `${extractCityID(suggestion['_links']['city:item'].href)}`,
      type: 'article',
      title: suggestion.matching_full_name,
      message_text: `${suggestion.matching_full_name}`,
    };
  });
}

export async function getLocationInfo(locationID) {
  const url = `https://api.teleport.org/api/cities/geonameid:${locationID}/`;
  const res = await fetch(url).then((r) => r.json());
  const location = {
    city: res.full_name,
    latitude: res.location.latlon.latitude,
    longitude: res.location.latlon.longitude,
  };

  return location;
}

function extractCityID(url) {
  const pattern = /([0-9])\w+/g;
  return pattern.exec(url)[0];
}
