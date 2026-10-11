
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 12000,
});

export const money = (n = 0) => {
  let currency = "INR";
  try {
    currency = localStorage.getItem("cafeos-currency") || "INR";
  } catch {}

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "INR" ? 0 : 2,
  }).format(Number(n) || 0);
};

export const shortDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

export const shortTime = (date) =>
  new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const getError = (e) =>
  e?.response?.data?.message ||
  "Something went wrong. Is the API and MongoDB running?";
