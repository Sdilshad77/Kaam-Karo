import axios from "axios";

const API = axios.create({
  baseURL: "https://kaam-karo-fed9.onrender.com",
});

export default API;