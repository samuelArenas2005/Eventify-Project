import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor de respuesta global
axios.interceptors.response.use(
  (response) => response,  // Si es exitoso, pasa sin cambios
  async (error) => {
    const originalRequest = error.config;

    // Si hay 401 y no hemos reintentado ya
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya hay un refresh en curso, espera
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intenta refresh
        const refreshResponse = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {}, { 
          withCredentials: true 
        });

        if (refreshResponse.data.success) {
          isRefreshing = false;
          processQueue(null, true);
          // Reintenta la petición original
          return axios(originalRequest);
        } else {
          throw new Error('Refresh failed');
        }
      } catch (refreshError) {
        // Refresh falló: logout y redirige
        isRefreshing = false;
        processQueue(refreshError, null);
        
        try {
          await axios.post('http://127.0.0.1:8000/api/token/logout/', {}, {
            withCredentials: true
          });
        } catch (logoutError) {
          console.error('Error during logout:', logoutError);
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
