import axios from "axios";

let accessToken: string | null = null;

// helper to update access token in memory
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "", // default to Next.js API routes
  timeout: 30000,
  withCredentials: true, // send cookies (refresh token)
});

// Interceptor to attach the token to each request
axiosInstance.interceptors.request.use((config) => {
  console.log('[access-Token]', accessToken?.substring(0, 10), '...')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Interceptor to handle errors & auto-refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const genericMessage = "Something went wrong.";

    console.error("[INTERCEPTOR - ERROR] => ", {
      message: error.message,
      code: error.code,
      response: error.response?.data?.message || error,
    });

    // Network error (no response from server)
    if (error.message === "Network Error") {
      error.userMessage = genericMessage;
      return Promise.reject(error);
    }

    // Timeout or no response
    if (error.code === "ECONNABORTED" || !error.response) {
      error.userMessage = genericMessage;
      return Promise.reject(error);
    }

    // HTML response from server (like 404 HTML page)
    if (
      typeof error.response?.data === "string" &&
      error.response.data.startsWith("<")
    ) {
      error.userMessage = genericMessage;
      return Promise.reject(error);
    }

    // handle expired token (401 Unauthorized)
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        // call refresh endpoint (cookie automatically sent)
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        console.log('refresh token response:', data)

        // update memory token
        setAccessToken(data.data.accessToken);

        // retry original request with new token
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosInstance(error.config);
      } catch (refreshErr) {
        setAccessToken(null);
        return Promise.reject(refreshErr);
      }
    }

    // Try to extract meaningful backend error message
    const backendMessage = error.response?.data?.message;
    if (typeof backendMessage === "string") {
      error.userMessage = backendMessage;
    } else {
      error.userMessage = genericMessage;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
