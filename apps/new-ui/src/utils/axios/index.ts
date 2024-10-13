import axios from "axios";

const apiAxios = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

axios.defaults.baseURL = process.env.BASE_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
