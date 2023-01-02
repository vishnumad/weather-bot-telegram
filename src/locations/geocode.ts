import fetch from '../fetch';
import getEnv from '../utils/environment';
import { GoogleMapsGeocodeResponse } from './types';

type GeocodeReturn = {
  formattedName: string;
  geometry: {
    lat: number;
    lng: number;
  };
};

async function geocode(input: string): Promise<GeocodeReturn> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${input}&key=${
      getEnv().googleMapsApiKey
    }`;

    const response = await fetch.get<GoogleMapsGeocodeResponse>(url);

    const selectedAddress = response.results[0];

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

export default geocode;
