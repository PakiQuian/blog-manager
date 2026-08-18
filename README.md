# Blog Manager

Prueba técnica — Fullstack Developer Trainee/Junior. Aplicación web para gestionar artículos de blog: autenticación, CRUD de artículos propios, y una página pública con listado de autores y buscador.

## Stack


| Área                       | Tecnología                                             |
| -------------------------- | ------------------------------------------------------ |
| Frontend                   | React + TypeScript + Vite + HeroUI                     |
| Datos y routing (frontend) | TanStack Query + TanStack Router                       |
| Formularios                | TanStack Form + Zod                                    |
| Backend                    | Hono                                                   |
| Validación                 | Zod (formularios y API)                                |
| Base de datos              | MongoDB, driver nativo (sin ORM/ODM)                   |
| Autenticación              | Better Auth (email + contraseña, sesiones server-side) |


## Estructura del repo

```
blog-manager/
  apps/
    backend/    # API Hono
    frontend/   # App React (Vite)
  docker-compose.yml   # MongoDB local
```

Monorepo con **npm workspaces** 

## Requisitos previos

- Node.js 20+
- npm 10+
- Docker Desktop (para MongoDB local)

## Instalación y ejecución local

```bash
# 1. Clonar e instalar dependencias (raíz + ambos workspaces)
git clone <este-repo>
cd blog-manager
npm install

# 2. Variables de entorno
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
# Editar apps/backend/.env y poner un valor propio en BETTER_AUTH_SECRET
# (cualquier string largo y aleatorio sirve para desarrollo local)

# 3. Levantar MongoDB
npm run dev:db

# 4. (Opcional) cargar datos de ejemplo — 3 autores con artículos
npm run seed --workspace=apps/backend

# 5. Levantar backend + frontend juntos
npm run dev
```

- Backend: [http://localhost:3000](http://localhost:3000)
- Frontend: [http://localhost:5173](http://localhost:5173)

Si preferís correrlos por separado: `npm run dev:backend` y `npm run dev:frontend` en terminales distintas.

Para bajar MongoDB: `npm run dev:db:down`.

### Cuentas de prueba (si corriste el seed)

Solo para desarrollo local — no correr el seed contra una base compartida o pública.

Todas con contraseña `password123`:

- `isaac@example.com`
- `marie@example.com`
- `ada@example.com`

## Variables de entorno

### `apps/backend/.env`


| Variable             | Descripción                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `MONGODB_URI`        | Connection string de MongoDB (`mongodb://localhost:27017` con el docker-compose incluido) |
| `DB_NAME`            | Nombre de la base de datos                                                                |
| `BETTER_AUTH_SECRET` | Clave usada para firmar sesiones/cookies. Cualquier string aleatorio largo en dev         |
| `BETTER_AUTH_URL`    | URL base del backend (`http://localhost:3000` en dev)                                     |
| `PORT`               | Puerto del servidor Hono                                                                  |
| `CORS_ORIGIN`        | Origen permitido para requests con cookies (URL del frontend)                             |


### `apps/frontend/.env`


| Variable       | Descripción                                      |
| -------------- | ------------------------------------------------ |
| `VITE_API_URL` | URL del backend (`http://localhost:3000` en dev) |


Ver `.env.example` en cada carpeta — sin credenciales reales.

## Decisiones técnicas

- **MongoDB standalone (sin replica set) en Docker**: Better Auth soporta transacciones multi-documento pasándole el `client` de Mongo al adapter, pero eso requiere un replica set — un contenedor Mongo suelto las rechaza. Se usa el adapter sin esa opción (`mongodbAdapter(db)`), ya que la app no necesita transacciones multi-documento.
- **Sesiones server-side, no JWT**: Better Auth, por defecto, guarda un token de sesión en una colección de Mongo y lo entrega como cookie httpOnly. Cada request protegida hace un lookup a la base para validar la sesión. Se eligió por ser el comportamiento por defecto de la librería y por permitir revocar sesiones al instante (borrar la fila) — algo que JWT no permite sin una blacklist aparte.
- **Detalle de artículo público**: `GET /api/articles/:id` no requiere autenticación — cualquiera puede leer un artículo encontrado en el buscador público, comportamiento típico de un blog. El endpoint devuelve un flag `isOwner` (calculado en el servidor a partir de la sesión, si existe) para que el frontend muestre los botones de editar/eliminar solo al dueño. Las mutaciones (`PUT`/`DELETE`) sí exigen sesión y validan ownership del lado del servidor de forma independiente — el flag del `GET` es solo para la UI, no es la barrera de seguridad real.
- **Ownership validado en el servidor**: editar o eliminar un artículo ajeno devuelve `403`, sin importar lo que muestre o permita el frontend. Se verificó manualmente con una segunda cuenta y con `curl` directo a la API.
- **Sin ORM**: se usa el driver nativo de `mongodb` como pide la consigna. El modelado de datos (forma de cada documento) se sostiene con interfaces TypeScript + validación Zod en cada endpoint, no con un schema de librería.
- **Paginación y búsqueda reflejadas en la URL**: `/articles?page=2` y `/?q=texto` — permite compartir/recargar sin perder el estado, y de paso resuelve el punto opcional de la consigna.
- **Búsqueda server-side con debounce**: el input espera 300ms sin cambios antes de consultar la API, para no disparar una request por cada tecla.
- **Breadcrumb propio en vez del `Breadcrumbs` de HeroUI**: el componente de HeroUI usa `href` plano en cada item, sin forma de integrarlo con el `Link` de TanStack Router (navegación client-side). Se construyó un componente chico a medida (`src/components/Breadcrumbs.tsx`) para poder linkear con el router real y controlar el estado de carga (skeleton) mientras se resuelve el nombre del autor o el título del artículo.

## Herramientas de IA utilizadas

Todo el proyecto (backend, frontend, debugging, y este README) se construyó con **Claude Code** (varios modelos de Claude, dependiendo de la tarea a realizar), usado como asistente conversacional dentro del editor/terminal. Uso concreto:

- Generación de código en base a decisiones discutidas explícitamente antes de escribir cada parte (arquitectura, estructura de rutas, manejo de ownership, etc.), no generación ciega.
- Consulta de documentación oficial actualizada (Better Auth, TanStack Router/Form, HeroUI + Tailwind v4) antes de implementar integraciones específicas, para evitar asumir APIs desactualizadas.
- Debugging real durante el desarrollo, entre otros:
  - Un 500 en el registro de usuarios causado por pedirle transacciones a Better Auth contra un Mongo sin replica set.
  - Autor "desconocido" y búsqueda vacía por una discrepancia de tipos entre `userId` (string) y `_id` de usuario (ObjectId) en las agregaciones de Mongo.
- Verificación funcional real en un navegador Chrome controlado por el asistente (extensión Claude in Chrome) — flujos de registro/login/logout, protección de rutas, CRUD de artículos y búsqueda pública se probaron clickeando la UI real, no solo revisando que el código compile.

## Scripts disponibles


| Comando                                   | Descripción                               |
| ----------------------------------------- | ----------------------------------------- |
| `npm run dev`                             | Backend + frontend en paralelo            |
| `npm run dev:backend`                     | Solo backend                              |
| `npm run dev:frontend`                    | Solo frontend                             |
| `npm run dev:db`                          | Levanta MongoDB (Docker)                  |
| `npm run dev:db:down`                     | Baja MongoDB                              |
| `npm run seed --workspace=apps/backend`   | Carga 3 usuarios de ejemplo con artículos |
| `npm run build --workspace=apps/backend`  | Compila el backend a `dist/`              |
| `npm run build --workspace=apps/frontend` | Build de producción del frontend          |
