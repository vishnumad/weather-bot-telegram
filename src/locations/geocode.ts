import fetch from '../fetch';
import { getEnvVars } from '../utils/environment';
import { GoogleMapsGeocodeResponse } from './types';

type GeocodeResponse = {
  formattedName: string;
  geometry: {
    lat: number;
    lng: number;
  };
};

const geocode = async (input: string): Promise<GeocodeResponse> => {
  try {
    const googleMapsApiKey = getEnvVars().googleMapsApiKey;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${input}&key=${googleMapsApiKey}`;

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
};

export default geocode;
