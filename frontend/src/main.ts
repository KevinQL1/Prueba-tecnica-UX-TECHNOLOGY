
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importación de los estilos globales y Tailwind CSS.
import './assets/main.css'

// Inicialización de la aplicación Vue.
const app = createApp(App)

app.use(router)

app.mount('#app')
