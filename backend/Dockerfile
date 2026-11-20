
# Etapa 1: instala dependencias y compila la aplicación.
FROM node:26-alpine AS builder

WORKDIR /app

# Copia los archivos de dependencias.
COPY package*.json ./

# Instala las dependencias necesarias para compilar.
RUN npm ci

# Copia el código fuente.
COPY . .

# Genera la compilación de NestJS.
RUN npm run build


# Etapa 2: prepara la imagen de ejecución.
FROM node:26-alpine AS production

WORKDIR /app

# Configura el entorno de ejecución.
ENV NODE_ENV=production

# Copia los archivos de dependencias.
COPY package*.json ./

# Instala únicamente las dependencias de producción.
RUN npm ci --omit=dev && npm cache clean --force

# Copia la compilación generada.
COPY --from=builder /app/dist ./dist

# Inicia el servidor NestJS.
CMD ["npm", "run", "start:prod"]
