const BASE_URL = "http://localhost:5000/api";

export const API = {
  login: `${BASE_URL}/auth/login`,
  register: `${BASE_URL}/auth/register`,
  reviews: `${BASE_URL}/reviews`,
  pending: `${BASE_URL}/reviews/pending`,
  reported: `${BASE_URL}/reviews/reported`,
};