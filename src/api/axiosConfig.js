
// import axios from "axios";

// axios.defaults.baseURL = "http://localhost:9193"; // Spring Boot backend

// // List of public endpoints that don't require authentication
// const publicEndpoints = [
//   '/api/auth/login',
//   '/api/users/', // POST for signup
//   '/api/auth/forgot-password',
//   '/api/auth/reset-password',
//   '/facilities/all',
//   '/facilities/',
//   '/media/all', // Gallery images
//   '/media/download', // Media downloads
//   '/api/branches', // Public branch listing
//   '/api/roomtypes', // Public room types
//   '/api/room-types', // Alternative room types endpoint
//  // '/api/rooms', // Public room browsing (GET only, handled by JwtFilter)
// ];

// axios.interceptors.request.use((config) => {
//   console.log('🔍 Axios Request:', {
//     method: config.method,
//     url: config.url,
//     fullURL: config.baseURL + config.url,
//     skipAuth: config.skipAuth,
//     hasToken: !!localStorage.getItem("token")
//   });

//   // Check if this request should skip authentication
//   if (config.skipAuth) {
//     console.log('✅ Skipping auth for this request (skipAuth flag)');
//     return config;
//   }

//   // Check if endpoint is public
//   const isPublicEndpoint = publicEndpoints.some(endpoint => {
//     // Special case for POST to /api/users (signup)
//     if (config.method === 'post' && config.url?.includes('/api/users')) {
//       return true;
//     }
//     // Check if URL starts with or includes the public endpoint
//     return config.url?.startsWith(endpoint) || config.url?.includes(endpoint);
//   });

//   if (isPublicEndpoint) {
//     console.log('✅ Public endpoint - no auth required');
//   } else {
//     console.log('🔒 Protected endpoint - adding auth');
//   }

//   // Only add token if not a public endpoint
//   if (!isPublicEndpoint) {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       console.log('✅ Token added to request');
//     } else {
//       console.log('⚠️ No token found in localStorage');
//     }
//   }

//   return config;
// });

// // Add response interceptor to log errors
// axios.interceptors.response.use(
//   (response) => {
//     console.log('✅ Response received:', response.status, response.config.url);
//     return response;
//   },
//   (error) => {
//     console.error('❌ Request failed:', {
//       url: error.config?.url,
//       method: error.config?.method,
//       status: error.response?.status,
//       statusText: error.response?.statusText,
//       data: error.response?.data,
//       headers: error.config?.headers
//     });
//     return Promise.reject(error);
//   }
// );

// export default axios;




import axios from "axios";

axios.defaults.baseURL = "http://localhost:9193";

// Endpoints that DO NOT require auth
const publicEndpoints = [
  "/api/auth/login",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/facilities/all",
  "/facilities/",
  "/media/all",
  "/media/download",
  "/api/branches",
  "/api/roomtypes",
  "/api/room-types",
];

// Special case for SIGNUP ONLY
const isSignupRequest = (config) =>
  config.method === "post" && config.url === "/api/users";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("🔍 Axios Request:", {
    method: config.method,
    url: config.url,
    fullURL: config.baseURL + config.url,
    hasToken: !!token,
  });

  // Skip auth if flag is set manually
  if (config.skipAuth) {
    console.log("⏭️ skipAuth flag used — no auth header added");
    return config;
  }

  // Determine whether endpoint is public
  const isPublic =
    isSignupRequest(config) ||
    publicEndpoints.some((ep) => config.url.startsWith(ep));

  if (!isPublic) {
    console.log("🔒 Protected endpoint — adding token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No token available");
    }
  } else {
    console.log("🌐 Public endpoint — no token required");
  }

  return config;
});

axios.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ Axios Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default axios;