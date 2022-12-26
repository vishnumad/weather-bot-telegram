/* eslint-disable dot-notation */
import fetch from 'node-fetch';
import getEnv from './environment';

async function getCitySuggestions(query) {
  const url = `https://api.teleport.org/api/cities/?search=${query}&limit=8`;
  const res = await fetch(url).then((r) => r.json());
  const suggestions = res['_embedded']['city:search-results'];

  return suggestions.map((suggestion) => ({
    id: `${extractCityID(suggestion['_links']['city:item'].href)}`,
    type: 'article',
    title: suggestion.matching_full_name,
    message_text: `${suggestion.matching_full_name}`,
  }));
}

async function getLocationInfo(locationID) {
  const url = `https://api.teleport.org/api/cities/geonameid:${locationID}/`;
  const res = await fetch(url).then((r) => r.json());
  const location = {
    city: res.full_name,
    latitude: res.location.latlon.latitude,
    longitude: res.location.latlon.longitude,
  };

  return location;
}

async function getAddressInfo(input) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${input}&key=${
      getEnv().googleMapsApiKey
    }`;

    const response = await fetch(url);

    const json = await response.json();

    console.info(`Retrieved geocode result for input ${input}...`);
    console.log(JSON.stringify(json));

    const selectedAddress = json.results[0];

    return {
      formattedName: selectedAddress.formatted_address,
      geometry: {
        lat: selectedAddress.geometry.location.lat,
        lng: selectedAddress.geometry.location.lng,
      },
    };
  } catch (error) {
    console.error('Error fetching geocode result from Google Maps...');
    console.error(error);
    throw error;
  }
}

function extractCityID(url) {
  const pattern = /([0-9])\w+/g;
  return pattern.exec(url)[0];
}

export { getCitySuggestions, getLocationInfo, getAddressInfo };
