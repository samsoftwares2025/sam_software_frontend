// src/api/http.js
import axios from "axios";
import { FULL_BASE } from "./config";

const http = axios.create({
  baseURL: FULL_BASE,
  timeout: 15000, // 15s
  withCredentials: true, // if backend uses cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// allow external modules to set auth token
export const setAuth = ({ token = null }) => {
  if (token) {
    http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common["Authorization"];
  }
};

// request logging (dev only)
http.interceptors.request.use((req) => {
  // attach timestamp for debugging
  req.metadata = { startTime: new Date() };
  console.info("[HTTP] →", req.method?.toUpperCase(), req.baseURL + req.url);
  return req;
});

// response & error handling
http.interceptors.response.use(
  (res) => {
    // simple timing log
    res.config.metadata.endTime = new Date();
    res.duration = res.config.metadata.endTime - res.config.metadata.startTime;
    console.info(`[HTTP] ← ${res.status} (${res.duration}ms)`, res.config.url);
    return res;
  },
  (error) => {
    // Normalize error for the UI and developer console
    if (error.response) {
      // server answered with status outside 2xx
      console.error("[HTTP] response error", {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url,
      });
    } else if (error.request) {
      // request made but no response received
      console.error("[HTTP] no response from server", {
        url: error.config ? error.config.url : "unknown",
        message: error.message,
        request: error.request,
      });
    } else {
      // other errors (setup)
      console.error("[HTTP] setup error", error.message);
    }
    return Promise.reject(error);
  }
);

export default http;
