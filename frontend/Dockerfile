
# Etapa 1: instala dependencias y construye Vue.
FROM node:26-alpine AS builder

WORKDIR /app

# Copia los archivos de dependencias.
COPY package*.json ./

# Instala las dependencias del proyecto.
RUN npm ci

# Copia el código fuente.
COPY . .

# Recibe la URL de la API durante la construcción.
ARG VITE_API_URL

# Expone la variable para que Vite la incorpore al build.
ENV VITE_API_URL=$VITE_API_URL

# Genera los archivos estáticos de producción.
RUN npm run build-only


# Etapa 2: sirve la aplicación con Nginx.
FROM nginx:alpine AS production

# Copia la compilación de Vue a Nginx.
COPY --from=builder /app/dist /usr/share/nginx/html

# Expone el puerto HTTP de Nginx.
EXPOSE 80

# Inicia Nginx en primer plano.
CMD ["nginx", "-g", "daemon off;"]
