import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.1.111:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  console.log(
    '[API REQUEST]',
    config.method?.toUpperCase(),
    `${config.baseURL}${config.url}`,
  );

  return config;
});

/*
import axios from 'axios';
import Constants from 'expo-constants';

const hostUri = Constants.expoConfig?.hostUri;
const host = hostUri?.split(':')[0];

if (!host) {
  throw new Error(
    'Não foi possível identificar o IP do computador pelo Expo.',
  );
}

export const api = axios.create({
  baseURL: `http://${host}:3000`,
  headers: {
    'Content-Type': 'application/json',
  },
});
*/