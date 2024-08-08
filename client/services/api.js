import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

export const registerUser = (userData) => API.post("/users/register", userData);
export const loginUser = (userData) => API.post("/users/login", userData);
