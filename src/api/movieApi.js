import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const LANGUAGE = "vi-VN";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
});

const hasApiKey = Boolean(API_KEY && API_KEY !== "your_tmdb_api_key_here");

client.interceptors.request.use((config) => {
  if (!hasApiKey) {
    throw new Error("missing-api-key");
  }

  config.params = {
    api_key: API_KEY,
    language: LANGUAGE,
    ...config.params,
  };

  return config;
});

const normalizeError = (error) => {
  if (error.message === "missing-api-key") {
    return new Error("Bạn cần điền VITE_TMDB_API_KEY trong file .env để tải dữ liệu phim.");
  }

  if (error.response?.status === 401) {
    return new Error("API key TMDB không hợp lệ. Hãy kiểm tra lại file .env.");
  }

  if (error.response?.status === 404) {
    return new Error("Không tìm thấy dữ liệu phim này.");
  }

  if (error.code === "ECONNABORTED") {
    return new Error("Kết nối tới TMDB quá lâu. Vui lòng thử lại sau.");
  }

  return new Error("Không thể tải dữ liệu phim. Vui lòng thử lại sau.");
};

const request = async (path, params = {}) => {
  try {
    const { data } = await client.get(path, { params });
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
};

export const movieApi = {
  getPopularMovies: (page = 1) =>
    request("/movie/popular", {
      page,
      region: "US",
    }),

  searchMovies: (query, page = 1) =>
    request("/search/movie", {
      query,
      page,
      include_adult: false,
    }),

  getMovieDetails: (movieId) =>
    request(`/movie/${movieId}`, {
      append_to_response: "credits,videos",
    }),
};

export const getImageUrl = (path, size = "w500") => {
  if (!path) return "";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path, size = "w1280") => {
  if (!path) return "";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getYear = (date) => {
  if (!date) return "Chưa rõ";
  return new Date(date).getFullYear();
};

export const formatRuntime = (minutes) => {
  if (!minutes) return "Chưa rõ";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours ? `${hours}h ${mins}m` : `${mins}m`;
};
