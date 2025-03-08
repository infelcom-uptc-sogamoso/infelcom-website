import axios from 'axios';

const infelcomApi = axios.create({
  baseURL: '/api',
});

export default infelcomApi;
