import axios from "axios";

const instance = axios.create({
  baseURL: `https://icanhazdadjoke.com`,
  headers: { Accept: 'application/json' }
});

export default instance;