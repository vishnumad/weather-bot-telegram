import fetch from 'node-fetch';

const get = async <T>(url: string): Promise<T> => {
  try {
    const encodedUrl = encodeURI(url);

    const response = await fetch(encodedUrl);

    const json = await response.json();

    if (!response.ok) {
      throw new Error(`Response not OK: ${JSON.stringify(json)}`);
    }

    console.log(JSON.stringify(json));

    return json as T;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export default {
  get,
};
