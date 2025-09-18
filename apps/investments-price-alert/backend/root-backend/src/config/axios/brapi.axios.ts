import axios from 'axios';

export const brapiAxios = axios.create({
  baseURL: 'https://brapi.dev/api',
  params: { token: process.env.BRAPI_API_KEY },
});
