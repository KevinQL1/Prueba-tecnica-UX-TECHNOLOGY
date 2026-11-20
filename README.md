# Prueba Técnica – UX Technology

Aplicación web para la gestión de órdenes de servicio, desarrollada como solución a la prueba técnica de UX Technology.

El proyecto permite consultar, crear, actualizar, filtrar y eliminar órdenes de servicio mediante una API REST y una interfaz web responsive.

## Tabla de contenidos

- [Arquitectura](#arquitectura)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Configuración del entorno](#configuración-del-entorno)
- [Ejecución con Docker](#ejecución-con-docker)
- [Ejecución en desarrollo](#ejecución-en-desarrollo)
- [Base de datos](#base-de-datos)
- [API REST](#api-rest)
- [Pruebas automatizadas](#pruebas-automatizadas)

## Arquitectura

La solución está organizada en tres componentes principales:

- **Frontend:** aplicación desarrollada con Vue 3 y TypeScript, encargada de la interfaz de usuario y la interacción con la API.
- **Backend:** API REST desarrollada con NestJS y TypeScript, responsable de la lógica de negocio, validaciones y operaciones CRUD.
- **Base de datos:** MySQL 8, utilizada para almacenar las órdenes de servicio.

Los servicios se ejecutan de manera independiente y se comunican mediante una red interna de Docker Compose.

## Tecnologías utilizadas

### Backend

- Node.js 26.
- NestJS 12.
- TypeScript 6.
- TypeORM.
- MySQL 8.
- Class Validator.
- Class Transformer.
- Swagger.
- Jest.
- Supertest.

### Frontend

- Vue 3.
- TypeScript 6.
- Vue Router.
- Composition API.
- Tailwind CSS 4.
- Axios.
- Vitest.
- Vue Test Utils.
- jsdom.

### Infraestructura

- Docker.
- Docker Compose.
- Nginx.
- MySQL 8.

## Estructura del proyecto

```text
Prueba-tecnica-UX-TECHNOLOGY/
│
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   └── ordenes/
│   │   ├── ...
│   │   └── main.ts
│   ├── test/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── interfaces/
│   │   ├── services/
│   │   ├── utils/
│   │   └── views/
│   ├── test/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
├── database/
│   └── init.sql
│
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Requisitos previos

Para ejecutar el proyecto se requiere:

- Node.js 26 o una versión compatible con los requisitos de cada aplicación.
- npm.
- Docker Desktop.
- Docker Compose.

## Configuración del entorno

En la raíz del proyecto se encuentra el archivo `.env.example`, que contiene las variables necesarias para ejecutar la aplicación.

Crear el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

En Windows PowerShell también se puede utilizar:

```powershell
Copy-Item .env.example .env
```

Configurar las siguientes variables:

| Variable | Descripción |
|---|---|
| `DB_ROOT_PASSWORD` | Contraseña del usuario root de MySQL. |
| `DB_DATABASE` | Nombre de la base de datos. |
| `DB_PORT` | Puerto local publicado para MySQL. |
| `DB_HOST` | Host de conexión local a MySQL. |
| `DB_USERNAME` | Usuario de conexión a MySQL. |
| `API_PORT` | Puerto de ejecución del backend. |
| `FRONTEND_PORT` | Puerto de acceso al frontend. |
| `VITE_API_URL` | URL base de conexión del frontend con la API. |

Para la configuración actual de Docker, el backend utiliza el servicio `mysql` como host interno y el usuario `root`.

**Importante:** el archivo `.env` contiene credenciales y no debe subirse al repositorio. Se encuentra excluido mediante `.gitignore`.

## Ejecución con Docker

La forma recomendada de ejecutar la aplicación completa es mediante Docker Compose.

Desde la raíz del proyecto, ejecutar:

```bash
docker compose up --build -d
```

Este comando construye las imágenes y levanta los tres servicios:

- MySQL.
- Backend NestJS.
- Frontend Vue servido mediante Nginx.

### Verificar los contenedores

```bash
docker compose ps
```

MySQL debe aparecer con estado `healthy` y los servicios de backend y frontend deben estar ejecutándose.

### Consultar los registros

```bash
docker compose logs
```

Para consultar un servicio específico:

```bash
docker compose logs backend
docker compose logs frontend
docker compose logs mysql
```

### Detener los servicios

```bash
docker compose down
```

Para detener los servicios y eliminar también los volúmenes de Docker:

```bash
docker compose down -v
```

**Advertencia:** la segunda instrucción elimina los datos persistidos de MySQL.

### Acceso a la aplicación

Las direcciones dependen de los puertos definidos en `.env`.

| Servicio | Dirección |
|---|---|
| Frontend | `http://localhost:FRONTEND_PORT` |
| Backend | `http://localhost:API_PORT/api` |
| Swagger | `http://localhost:API_PORT/api/docs` |
| MySQL | `localhost:DB_PORT` |

Reemplazar los valores de puerto por los configurados en el archivo `.env`.

## Ejecución en desarrollo

También es posible ejecutar cada aplicación de manera independiente.

### Backend

Ingresar al directorio:

```bash
cd backend
```

Instalar dependencias:

```bash
npm ci
```

Iniciar en modo desarrollo:

```bash
npm run start:dev
```

Compilar:

```bash
npm run build
```

Ejecutar en producción:

```bash
npm run start:prod
```

### Frontend

Ingresar al directorio:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm ci
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Verificar los tipos de TypeScript:

```bash
npm run type-check
```

Generar la compilación de producción:

```bash
npm run build
```

Para ejecutar ambos proyectos localmente, MySQL debe estar disponible y las variables de conexión deben estar correctamente configuradas.

## Base de datos

El proyecto utiliza MySQL 8 y dispone de un script de inicialización ubicado en:

```text
database/init.sql
```

Este script se encarga de:

1. Configurar la codificación UTF-8 mediante `utf8mb4`.
2. Crear la base de datos.
3. Crear la tabla `ordenes_servicio`.
4. Definir restricciones y validaciones a nivel de base de datos.
5. Insertar registros iniciales de ejemplo.

### Tabla principal: ordenes_servicio

| Campo | Descripción |
|---|---|
| `id` | Identificador único. |
| `codigo_orden` | Código de referencia único. |
| `cliente_nombre` | Nombre del cliente. |
| `cantidad_items` | Cantidad de productos o servicios. |
| `valor_total` | Valor total de la orden. |
| `porcentaje_descuento` | Porcentaje de descuento. |
| `fecha_solicitud` | Fecha de solicitud. |
| `estado` | Estado actual de la orden. |
| `prioridad` | Prioridad asignada. |
| `observaciones` | Información adicional. |
| `activo` | Indicador de eliminación lógica. |
| `fecha_creacion` | Fecha de creación del registro. |
| `fecha_actualizacion` | Fecha de última actualización. |

La eliminación de órdenes se realiza mediante borrado lógico, utilizando el campo `activo`.

## API REST

La API utiliza el prefijo global `/api`.

### Documentación Swagger

La documentación interactiva está disponible en:

```text
http://localhost:API_PORT/api/docs
```

### Endpoints disponibles

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/ordenes` | Consultar órdenes con paginación y filtros. |
| GET | `/api/ordenes/:id` | Consultar una orden por identificador. |
| POST | `/api/ordenes` | Crear una orden. |
| PUT | `/api/ordenes/:id` | Actualizar una orden. |
| DELETE | `/api/ordenes/:id` | Eliminar lógicamente una orden. |

### Filtros de consulta

El endpoint `GET /api/ordenes` permite utilizar los siguientes parámetros:

| Parámetro | Descripción |
|---|---|
| `page` | Número de página. |
| `limit` | Cantidad de registros por página. |
| `cliente_nombre` | Filtro por nombre del cliente. |
| `estado` | Filtro por estado de la orden. |

### Validaciones

El backend implementa validaciones mediante `class-validator` y `class-transformer`.

Se utiliza un `ValidationPipe` global para transformar los datos de entrada, excluir propiedades no permitidas y rechazar propiedades adicionales.

## Pruebas automatizadas

El proyecto cuenta con pruebas unitarias, de integración y pruebas de componentes, servicios y vistas.

### Backend

Desde el directorio `backend`:

Ejecutar las pruebas:

```bash
npm run test
```

Ejecutar con cobertura:

```bash
npm run test:coverage
```

Ejecutar pruebas E2E:

```bash
npm run test:e2e
```

### Frontend

Desde el directorio `frontend`:

Ejecutar las pruebas:

```bash
npm run test
```

Ejecutar con cobertura:

```bash
npm run test:coverage
```

Ejecutar verificación de tipos:

```bash
npm run type-check
```

## Autor

Kevin Alexander Quintero Londoño - Ingeniero Informático

Desarrollado como solución a la prueba técnica de UX Technology.

**Repositorio:** [Prueba Técnica – UX Technology](https://github.com/KevinQL1/Prueba-tecnica-UX-TECHNOLOGY)
