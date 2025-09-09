import axios, { type AxiosInstance } from "axios";


const API_KEY = import.meta.env.OLI_APP_ZENOTI_API_Key;
const zenoti: AxiosInstance = axios.create({
  baseURL: "https://api.zenoti.com/v1/",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `apikey ${API_KEY}`,
  },
});

export default zenoti;