import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Auto-logout on 401s so a stale/expired token doesn't get reused.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

// ---- Auth ----
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (payload) => api.post('/auth/register', payload),
  me: () => api.get('/auth/me'),
}

// ---- Tasks ----
// Routes match the backend's mount point (app.use("/api/task", taskRoutes))
// combined with taskRoutes.js exactly:
//   POST   /api/task/postTasks
//   GET    /api/task/getTasks
//   PUT    /api/task/:id
//   DELETE /api/task/:id
export const taskApi = {
  getAll: (params) => api.get('/task/getTasks', { params }),
  create: (formData) =>
    api.post('/task/postTasks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, formData) =>
    api.put(`/task/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  remove: (id) => api.delete(`/task/${id}`),
}

export default api
