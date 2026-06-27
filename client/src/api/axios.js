import axios from "axios";

const API = axios.create({
  baseURL: "https://ito-project.onrender.com/api",
});

// Automatically attach token to every request
API.interceptors.request.use((req) => {
  const user = localStorage.getItem("ito_user");
  if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  }
  return req;
});

export default API;