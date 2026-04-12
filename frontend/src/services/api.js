import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001",
});

//Attach authentication token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//URL to load images from recipes:
export const BASE_URL = "http://localhost:5001";

//-------------------- Endpoints -----------------------

//Recipes
export const getRecipes = (params = {}) => api.get("/api/recipes", { params });
export const getUserRecipes = (params = {}) =>
  api.get("/api/recipes/my-recipes", { params });
export const getRecipe = (id) => api.get(`/api/recipes/${id}`);
export const createRecipe = (data) => api.post("/api/recipes", data);
export const updateRecipe = (id, data) => api.put(`/api/recipes/${id}`, data);
export const deleteRecipe = (id) => api.delete(`/api/recipes/${id}`);

// Users
export const register = (data) => api.post("/api/users/register", data);
export const login = (data) => api.post("/api/users/login", data);
export const getCurrentUser = () => api.get("/api/users/current");
export const updateUser = (data) => api.put("api/users/profile", data);
