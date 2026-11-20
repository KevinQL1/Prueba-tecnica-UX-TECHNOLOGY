import axios from 'axios'

// Crea una instancia de Axios con la URL configurada en el entorno.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

export default api
