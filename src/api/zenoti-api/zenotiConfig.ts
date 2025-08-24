import axios, { type AxiosInstance } from "axios";

const zenoti: AxiosInstance = axios.create({
  baseURL: "https://api.zenoti.com/v1/",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `apikey ${'6a67119017324d688ae29d1071fa0f5b8700a587aa784d1f87c6fc035c3d77b8'}`,
  },
});

export default zenoti;