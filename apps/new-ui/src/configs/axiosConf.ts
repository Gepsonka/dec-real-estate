import axios from "axios";

axios.defaults.baseURL = process.env.BASE_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
