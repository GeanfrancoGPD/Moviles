# Proyecto Moviles

Este workspace actualmente contiene las siguentes app(`React_native` y `backend`).

Este README documenta las peticiones HTTP **actuales** del backend en Node.js + Express.

## Backend API

Base URL local:

```text
http://localhost:5000
```

Carpeta backend:

```text
backend/
```

## Levantar el servidor

Desde `backend/`:

```bash
npm install
npm run dev
```

Variables esperadas en entorno (`.env`):

- `PORT` (opcional, por defecto `5000`)
- `DB_USER`
- `DB_HOST`
- `DB_DATABASE`
- `DB_PASSWORD`
- `DB_PORT`
- `DB_MAX` (opcional)
- `DB_IDLE_TIMEOUT` (opcional)
- `DB_CONN_TIMEOUT` (opcional)

## CORS y sesion

- Orígenes permitidos en código: `https://localhost` y `http://localhost:5000`.
- Usa cookie de sesion con `express-session`.
- En peticiones desde frontend, enviar credenciales (`credentials: 'include'` en `fetch`).

## Endpoints HTTP actuales

### 1) Login

`POST /api/login`

Body JSON:

```json
{
	"email": "usuario@correo.com",
	"password": "123456"
}
```

Respuestas comunes:

- `200`: login exitoso, crea sesion.
- `400`: faltan datos.
- `401`: usuario no encontrado o contrasena incorrecta.

Ejemplo:

```bash
curl -X POST http://localhost:5000/api/login \
	-H "Content-Type: application/json" \
	-c cookies.txt \
	-d '{"email":"usuario@correo.com","password":"123456"}'
```

### 2) Registro

`POST /api/register`

Body JSON:

```json
{
	"nombre": "Juan",
	"email": "juan@correo.com",
	"password": "123456",
	"tipo_usuario": 2
}
```

Notas:

- `tipo_usuario` es opcional.
- Si no se envia, el backend intenta buscar el tipo "Cliente" en base de datos.

Respuestas comunes:

- `200`: usuario creado.
- `402`: faltan datos requeridos.
- `500`: error al resolver tipo de usuario por defecto.

Ejemplo:

```bash
curl -X POST http://localhost:5000/api/register \
	-H "Content-Type: application/json" \
	-d '{"nombre":"Juan","email":"juan@correo.com","password":"123456"}'
```

### 3) Logout

`POST /api/logout`

No requiere body.

Respuestas comunes:

- `200`: sesion cerrada.
- `500`: error al destruir sesion.

Ejemplo:

```bash
curl -X POST http://localhost:5000/api/logout \
	-b cookies.txt
```

### 4) Ejecutar consulta por nombre

`POST /api/toProccess`

Body JSON:

```json
{
	"namequery": "getUsers",
	"params": {}
}
```

Respuestas comunes:

- `200`: retorna `{ success: true, data: [...] }`.
- `500`: error al ejecutar la consulta.

Ejemplo:

```bash
curl -X POST http://localhost:5000/api/toProccess \
	-H "Content-Type: application/json" \
	-b cookies.txt \
	-d '{"namequery":"getNotasByUsuario","params":{"usuario_id":1}}'
```

## `namequery` disponibles en `/api/toProccess`

Estas consultas salen de `backend/data/query.json`:

- `getUsers`
- `getUser` (params: `gmail`)
- `getUserById` (params: `id`)
- `createUser` (params: `nombre`, `gmail`, `password`)
- `updateUser` (params: `nombre`, `gmail`, `password`, `id`)
- `deleteUser` (params: `id`)
- `getNotas`
- `getNotaById` (params: `id`)
- `getNotasByUsuario` (params: `usuario_id`)
- `createNota` (params: `titulo`, `contenido`, `usuario_id`)
- `updateNota` (params: `titulo`, `contenido`, `usuario_id`, `id`)
- `deleteNota` (params: `id`)


****## Estructura de respuesta (general)

Respuesta exitosa tipica:

```json
{
	"success": true,
	"message": "...",
	"data": []
}
```

Respuesta de error típica:

```json
{
	"success": false,
	"message": "..."
}
```

