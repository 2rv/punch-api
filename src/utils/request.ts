import axios from 'axios';

export const Api = axios.create({
  timeout: 10000,
});
