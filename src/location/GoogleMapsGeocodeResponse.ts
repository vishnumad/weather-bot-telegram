const sampleResponse = {
  results: [
    {
      address_components: [
        {
          long_name: 'Singapore',
          short_name: 'SG',
          types: ['country', 'political'],
        },
      ],
      formatted_address: 'Singapore',
      geometry: {
        bounds: {
          northeast: {
            lat: 1.4784001,
            lng: 104.0945001,
          },
          southwest: {
            lat: 1.1496,
            lng: 103.594,
          },
        },
        location: {
          lat: 1.352083,
          lng: 103.819836,
        },
        location_type: 'APPROXIMATE',
        viewport: {
          northeast: {
            lat: 1.4784001,
            lng: 104.0945001,
          },
          southwest: {
            lat: 1.1496,
            lng: 103.594,
          },
        },
      },
      place_id: 'ChIJdZOLiiMR2jERxPWrUs9peIg',
      types: ['country', 'political'],
    },
  ],
  status: 'OK',
};

type GoogleMapsGeocodeResponse = typeof sampleResponse;

export default GoogleMapsGeocodeResponse;
