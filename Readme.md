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
- `DB_DATABASE`# API de Recetas

## Base URL

```http
/api
```

## Autenticación

Las rutas protegidas requieren una sesión válida generada mediante `login`.

---

# Autenticación

## Login

Inicia sesión y crea una sesión para el usuario.

### Endpoint

```http
POST /login
```

### Request

```json
{
  "gmail": "usuario@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Juan Perez",
    "gmail": "usuario@gmail.com",
    "avatar": null
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

## Register

Registra un nuevo usuario.

### Endpoint

```http
POST /register
```

### Request

```json
{
  "nombre": "Juan Perez",
  "gmail": "usuario@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Juan Perez",
    "email": "usuario@gmail.com",
    "avatar": null
  }
}
```

---

## Logout

Finaliza la sesión actual.

### Endpoint

```http
POST /logout
```

### Response

```json
{
  "success": true
}
```

---

# Recetas Públicas

## Obtener recetas públicas

Devuelve todas las recetas marcadas como públicas.

### Endpoint

```http
GET /public-recipes
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Pizza Casera",
      "descripcion": "Pizza italiana",
      "imagen_key": "pizza.jpg",
      "tiempo_coccion": 30,
      "dificultad": "Media",
      "calorias": 600,
      "porciones": 4,
      "is_public": true,
      "usuario_id": 1,
      "created_at": "2025-01-01T12:00:00.000Z"
    }
  ]
}
```

---

# Recetas del Usuario

🔒 Requiere autenticación.

## Obtener recetas de un usuario

### Endpoint

```http
GET /users/:usuarioId/recipes
```

### Parámetros

| Nombre    | Tipo   | Descripción    |
| --------- | ------ | -------------- |
| usuarioId | number | ID del usuario |

### Ejemplo

```http
GET /users/1/recipes
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Pizza Casera",
      "descripcion": "Pizza italiana",
      "imagen_key": "pizza.jpg",
      "tiempo_coccion": 30,
      "dificultad": "Media",
      "calorias": 600,
      "porciones": 4,
      "is_public": true,
      "usuario_id": 1,
      "created_at": "2025-01-01T12:00:00.000Z"
    }
  ]
}
```

### Error

```json
{
  "success": false,
  "message": "Usuario inválido"
}
```

---

# Grupos

🔒 Requiere autenticación.

## Obtener grupos del usuario

### Endpoint

```http
GET /users/:usuarioId/groups
```

### Parámetros

| Nombre    | Tipo   |
| --------- | ------ |
| usuarioId | number |

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Comidas Italianas",
      "descripcion": "Recetas de Italia",
      "receta_count": 12
    }
  ]
}
```

---

# Recetas

## Obtener detalle de una receta

### Endpoint

```http
GET /recipes/:recipeId
```

### Parámetros

| Nombre   | Tipo   |
| -------- | ------ |
| recipeId | number |

### Response

```json
{
  "success": true,
  "data": {
    "id": 5,
    "titulo": "Pizza Casera",
    "descripcion": "Pizza tradicional italiana",
    "imagen_key": "pizza.jpg",
    "tiempo_coccion": 30,
    "dificultad": "Media",
    "calorias": 600,
    "porciones": 4,
    "is_public": true,
    "usuario_id": 1,
    "ingredientes": [
      {
        "id": 1,
        "nombre": "Harina",
        "cantidad": "500g",
        "orden": 1
      }
    ],
    "pasos": [
      {
        "id": 1,
        "descripcion": "Mezclar ingredientes",
        "orden": 1
      }
    ]
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Receta no encontrada"
}
```

---

## Crear receta

🔒 Requiere autenticación.

### Endpoint

```http
POST /recipes
```

### Request

```json
{
  "titulo": "Pizza Casera",
  "descripcion": "Pizza italiana",
  "imagen_key": "pizza.jpg",
  "tiempo_coccion": 30,
  "dificultad": "Media",
  "calorias": 600,
  "porciones": 4,
  "is_public": true,
  "ingredients": [
    {
      "nombre": "Harina",
      "cantidad": "500g"
    },
    {
      "nombre": "Queso",
      "cantidad": "250g"
    }
  ],
  "steps": [
    {
      "descripcion": "Preparar masa"
    },
    {
      "descripcion": "Hornear"
    }
  ],
  "wantsGroup": true,
  "groupId": 1
}
```

### Campos

| Campo          | Tipo    | Requerido |
| -------------- | ------- | --------- |
| titulo         | string  | Sí        |
| descripcion    | string  | Sí        |
| imagen_key     | string  | Sí        |
| tiempo_coccion | number  | Sí        |
| dificultad     | string  | Sí        |
| calorias       | number  | Sí        |
| porciones      | number  | Sí        |
| is_public      | boolean | Sí        |
| ingredients    | array   | Sí        |
| steps          | array   | Sí        |
| wantsGroup     | boolean | No        |
| groupId        | number  | No        |

### Response

```json
{
  "success": true,
  "data": {
    "id": 15,
    "titulo": "Pizza Casera",
    "descripcion": "Pizza italiana",
    "imagen_key": "pizza.jpg",
    "tiempo_coccion": 30,
    "dificultad": "Media",
    "calorias": 600,
    "porciones": 4,
    "is_public": true,
    "usuario_id": 1
  }
}
```

### Error

```json
{
  "success": false,
  "message": "No se pudo crear la receta"
}
```

---

## Eliminar receta

🔒 Requiere autenticación.

### Endpoint

```http
DELETE /recipes/:recipeId
```

### Parámetros

| Nombre   | Tipo   |
| -------- | ------ |
| recipeId | number |

### Ejemplo

```http
DELETE /recipes/15
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 15
  }
}
```

### Error

```json
{
  "success": false,
  "message": "No se encontró la receta o no pertenece al usuario"
}
```

---

# Perfil de Usuario

🔒 Requiere autenticación.

## Actualizar perfil

### Endpoint

```http
PUT /profile
```

### Request

```json
{
  "nombre": "Juan Perez",
  "gmail": "juan@gmail.com"
}
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Juan Perez",
      "email": "juan@gmail.com",
      "avatar": null
    }
  ]
}
```

---

## Actualizar contraseña

🔒 Requiere autenticación.

### Endpoint

```http
PUT /password
```

### Request

```json
{
  "password": "NuevaPassword123"
}
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1
    }
  ]
}
```

### Error

```json
{
  "success": false,
  "message": "No se pudo actualizar la contraseña"
}
```

---

# Códigos HTTP utilizados

| Código | Descripción                |
| ------ | -------------------------- |
| 200    | Operación exitosa          |
| 201    | Recurso creado             |
| 400    | Datos inválidos            |
| 401    | No autenticado             |
| 404    | Recurso no encontrado      |
| 500    | Error interno del servidor |

---

# Modelo de Datos

## Usuario

```json
{
  "id": 1,
  "nombre": "Juan Perez",
  "gmail": "usuario@gmail.com",
  "avatar": null
}
```

## Receta

```json
{
  "id": 1,
  "titulo": "Pizza Casera",
  "descripcion": "Pizza italiana",
  "imagen_key": "pizza.jpg",
  "tiempo_coccion": 30,
  "dificultad": "Media",
  "calorias": 600,
  "porciones": 4,
  "is_public": true,
  "usuario_id": 1
}
```

## Ingrediente

```json
{
  "id": 1,
  "nombre": "Harina",
  "cantidad": "500g",
  "orden": 1
}
```

## Paso

```json
{
  "id": 1,
  "descripcion": "Preparar masa",
  "orden": 1
}
```

## Grupo

```json
{
  "id": 1,
  "nombre": "Comidas Italianas",
  "descripcion": "Recetas italianas",
  "receta_count": 12
}
```

# API de Recetas

## Base URL

```http
/api
```

## Autenticación

Las rutas protegidas requieren una sesión válida generada mediante `login`.

---

# Autenticación

## Login

Inicia sesión y crea una sesión para el usuario.

### Endpoint

```http
POST /login
```

### Request

```json
{
  "gmail": "usuario@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Juan Perez",
    "gmail": "usuario@gmail.com",
    "avatar": null
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

## Register

Registra un nuevo usuario.

### Endpoint

```http
POST /register
```

### Request

```json
{
  "nombre": "Juan Perez",
  "gmail": "usuario@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Juan Perez",
    "email": "usuario@gmail.com",
    "avatar": null
  }
}
```

---

## Logout

Finaliza la sesión actual.

### Endpoint

```http
POST /logout
```

### Response

```json
{
  "success": true
}
```

---

# Recetas Públicas

## Obtener recetas públicas

Devuelve todas las recetas marcadas como públicas.

### Endpoint

```http
GET /public-recipes
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Pizza Casera",
      "descripcion": "Pizza italiana",
      "imagen_key": "pizza.jpg",
      "tiempo_coccion": 30,
      "dificultad": "Media",
      "calorias": 600,
      "porciones": 4,
      "is_public": true,
      "usuario_id": 1,
      "created_at": "2025-01-01T12:00:00.000Z"
    }
  ]
}
```

---

# Recetas del Usuario

🔒 Requiere autenticación.

## Obtener recetas de un usuario

### Endpoint

```http
GET /users/:usuarioId/recipes
```

### Parámetros

| Nombre    | Tipo   | Descripción    |
| --------- | ------ | -------------- |
| usuarioId | number | ID del usuario |

### Ejemplo

```http
GET /users/1/recipes
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Pizza Casera",
      "descripcion": "Pizza italiana",
      "imagen_key": "pizza.jpg",
      "tiempo_coccion": 30,
      "dificultad": "Media",
      "calorias": 600,
      "porciones": 4,
      "is_public": true,
      "usuario_id": 1,
      "created_at": "2025-01-01T12:00:00.000Z"
    }
  ]
}
```

### Error

```json
{
  "success": false,
  "message": "Usuario inválido"
}
```

---

# Grupos

🔒 Requiere autenticación.

## Obtener grupos del usuario

### Endpoint

```http
GET /users/:usuarioId/groups
```

### Parámetros

| Nombre    | Tipo   |
| --------- | ------ |
| usuarioId | number |

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Comidas Italianas",
      "descripcion": "Recetas de Italia",
      "receta_count": 12
    }
  ]
}
```

---

# Recetas

## Obtener detalle de una receta

### Endpoint

```http
GET /recipes/:recipeId
```

### Parámetros

| Nombre   | Tipo   |
| -------- | ------ |
| recipeId | number |

### Response

```json
{
  "success": true,
  "data": {
    "id": 5,
    "titulo": "Pizza Casera",
    "descripcion": "Pizza tradicional italiana",
    "imagen_key": "pizza.jpg",
    "tiempo_coccion": 30,
    "dificultad": "Media",
    "calorias": 600,
    "porciones": 4,
    "is_public": true,
    "usuario_id": 1,
    "ingredientes": [
      {
        "id": 1,
        "nombre": "Harina",
        "cantidad": "500g",
        "orden": 1
      }
    ],
    "pasos": [
      {
        "id": 1,
        "descripcion": "Mezclar ingredientes",
        "orden": 1
      }
    ]
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Receta no encontrada"
}
```

---

## Crear receta

🔒 Requiere autenticación.

### Endpoint

```http
POST /recipes
```

### Request

```json
{
  "titulo": "Pizza Casera",
  "descripcion": "Pizza italiana",
  "imagen_key": "pizza.jpg",
  "tiempo_coccion": 30,
  "dificultad": "Media",
  "calorias": 600,
  "porciones": 4,
  "is_public": true,
  "ingredients": [
    {
      "nombre": "Harina",
      "cantidad": "500g"
    },
    {
      "nombre": "Queso",
      "cantidad": "250g"
    }
  ],
  "steps": [
    {
      "descripcion": "Preparar masa"
    },
    {
      "descripcion": "Hornear"
    }
  ],
  "wantsGroup": true,
  "groupId": 1
}
```

### Campos

| Campo          | Tipo    | Requerido |
| -------------- | ------- | --------- |
| titulo         | string  | Sí        |
| descripcion    | string  | Sí        |
| imagen_key     | string  | Sí        |
| tiempo_coccion | number  | Sí        |
| dificultad     | string  | Sí        |
| calorias       | number  | Sí        |
| porciones      | number  | Sí        |
| is_public      | boolean | Sí        |
| ingredients    | array   | Sí        |
| steps          | array   | Sí        |
| wantsGroup     | boolean | No        |
| groupId        | number  | No        |

### Response

```json
{
  "success": true,
  "data": {
    "id": 15,
    "titulo": "Pizza Casera",
    "descripcion": "Pizza italiana",
    "imagen_key": "pizza.jpg",
    "tiempo_coccion": 30,
    "dificultad": "Media",
    "calorias": 600,
    "porciones": 4,
    "is_public": true,
    "usuario_id": 1
  }
}
```

### Error

```json
{
  "success": false,
  "message": "No se pudo crear la receta"
}
```

---

## Eliminar receta

🔒 Requiere autenticación.

### Endpoint

```http
DELETE /recipes/:recipeId
```

### Parámetros

| Nombre   | Tipo   |
| -------- | ------ |
| recipeId | number |

### Ejemplo

```http
DELETE /recipes/15
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 15
  }
}
```

### Error

```json
{
  "success": false,
  "message": "No se encontró la receta o no pertenece al usuario"
}
```

---

# Perfil de Usuario

🔒 Requiere autenticación.

## Actualizar perfil

### Endpoint

```http
PUT /profile
```

### Request

```json
{
  "nombre": "Juan Perez",
  "gmail": "juan@gmail.com"
}
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Juan Perez",
      "email": "juan@gmail.com",
      "avatar": null
    }
  ]
}
```

---

## Actualizar contraseña

🔒 Requiere autenticación.

### Endpoint

```http
PUT /password
```

### Request

```json
{
  "password": "NuevaPassword123"
}
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1
    }
  ]
}
```

### Error

```json
{
  "success": false,
  "message": "No se pudo actualizar la contraseña"
}
```

---

# Códigos HTTP utilizados

| Código | Descripción                |
| ------ | -------------------------- |
| 200    | Operación exitosa          |
| 201    | Recurso creado             |
| 400    | Datos inválidos            |
| 401    | No autenticado             |
| 404    | Recurso no encontrado      |
| 500    | Error interno del servidor |

---

# Modelo de Datos

## Usuario

```json
{
  "id": 1,
  "nombre": "Juan Perez",
  "gmail": "usuario@gmail.com",
  "avatar": null
}
```

## Receta

```json
{
  "id": 1,
  "titulo": "Pizza Casera",
  "descripcion": "Pizza italiana",
  "imagen_key": "pizza.jpg",
  "tiempo_coccion": 30,
  "dificultad": "Media",
  "calorias": 600,
  "porciones": 4,
  "is_public": true,
  "usuario_id": 1
}
```

## Ingrediente

```json
{
  "id": 1,
  "nombre": "Harina",
  "cantidad": "500g",
  "orden": 1
}
```

## Paso

```json
{
  "id": 1,
  "descripcion": "Preparar masa",
  "orden": 1
}
```

## Grupo

```json
{
  "id": 1,
  "nombre": "Comidas Italianas",
  "descripcion": "Recetas italianas",
  "receta_count": 12
}
```

# API de Recetas

## Base URL

```http
/api
```

## Autenticación

Las rutas protegidas requieren una sesión válida generada mediante `login`.

---

# Autenticación

## Login

Inicia sesión y crea una sesión para el usuario.

### Endpoint

```http
POST /login
```

### Request

```json
{
  "gmail": "usuario@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Juan Perez",
    "gmail": "usuario@gmail.com",
    "avatar": null
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

## Register

Registra un nuevo usuario.

### Endpoint

```http
POST /register
```

### Request

```json
{
  "nombre": "Juan Perez",
  "gmail": "usuario@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Juan Perez",
    "email": "usuario@gmail.com",
    "avatar": null
  }
}
```

---

## Logout

Finaliza la sesión actual.

### Endpoint

```http
POST /logout
```

### Response

```json
{
  "success": true
}
```

---

# Recetas Públicas

## Obtener recetas públicas

Devuelve todas las recetas marcadas como públicas.

### Endpoint

```http
GET /public-recipes
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Pizza Casera",
      "descripcion": "Pizza italiana",
      "imagen_key": "pizza.jpg",
      "tiempo_coccion": 30,
      "dificultad": "Media",
      "calorias": 600,
      "porciones": 4,
      "is_public": true,
      "usuario_id": 1,
      "created_at": "2025-01-01T12:00:00.000Z"
    }
  ]
}
```

---

# Recetas del Usuario

🔒 Requiere autenticación.

## Obtener recetas de un usuario

### Endpoint

```http
GET /users/:usuarioId/recipes
```

### Parámetros

| Nombre    | Tipo   | Descripción    |
| --------- | ------ | -------------- |
| usuarioId | number | ID del usuario |

### Ejemplo

```http
GET /users/1/recipes
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Pizza Casera",
      "descripcion": "Pizza italiana",
      "imagen_key": "pizza.jpg",
      "tiempo_coccion": 30,
      "dificultad": "Media",
      "calorias": 600,
      "porciones": 4,
      "is_public": true,
      "usuario_id": 1,
      "created_at": "2025-01-01T12:00:00.000Z"
    }
  ]
}
```

### Error

```json
{
  "success": false,
  "message": "Usuario inválido"
}
```

---

# Grupos

🔒 Requiere autenticación.

## Obtener grupos del usuario

### Endpoint

```http
GET /users/:usuarioId/groups
```

### Parámetros

| Nombre    | Tipo   |
| --------- | ------ |
| usuarioId | number |

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Comidas Italianas",
      "descripcion": "Recetas de Italia",
      "receta_count": 12
    }
  ]
}
```

---

# Recetas

## Obtener detalle de una receta

### Endpoint

```http
GET /recipes/:recipeId
```

### Parámetros

| Nombre   | Tipo   |
| -------- | ------ |
| recipeId | number |

### Response

```json
{
  "success": true,
  "data": {
    "id": 5,
    "titulo": "Pizza Casera",
    "descripcion": "Pizza tradicional italiana",
    "imagen_key": "pizza.jpg",
    "tiempo_coccion": 30,
    "dificultad": "Media",
    "calorias": 600,
    "porciones": 4,
    "is_public": true,
    "usuario_id": 1,
    "ingredientes": [
      {
        "id": 1,
        "nombre": "Harina",
        "cantidad": "500g",
        "orden": 1
      }
    ],
    "pasos": [
      {
        "id": 1,
        "descripcion": "Mezclar ingredientes",
        "orden": 1
      }
    ]
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Receta no encontrada"
}
```

---

## Crear receta

🔒 Requiere autenticación.

### Endpoint

```http
POST /recipes
```

### Request

```json
{
  "titulo": "Pizza Casera",
  "descripcion": "Pizza italiana",
  "imagen_key": "pizza.jpg",
  "tiempo_coccion": 30,
  "dificultad": "Media",
  "calorias": 600,
  "porciones": 4,
  "is_public": true,
  "ingredients": [
    {
      "nombre": "Harina",
      "cantidad": "500g"
    },
    {
      "nombre": "Queso",
      "cantidad": "250g"
    }
  ],
  "steps": [
    {
      "descripcion": "Preparar masa"
    },
    {
      "descripcion": "Hornear"
    }
  ],
  "wantsGroup": true,
  "groupId": 1
}
```

### Campos

| Campo          | Tipo    | Requerido |
| -------------- | ------- | --------- |
| titulo         | string  | Sí        |
| descripcion    | string  | Sí        |
| imagen_key     | string  | Sí        |
| tiempo_coccion | number  | Sí        |
| dificultad     | string  | Sí        |
| calorias       | number  | Sí        |
| porciones      | number  | Sí        |
| is_public      | boolean | Sí        |
| ingredients    | array   | Sí        |
| steps          | array   | Sí        |
| wantsGroup     | boolean | No        |
| groupId        | number  | No        |

### Response

```json
{
  "success": true,
  "data": {
    "id": 15,
    "titulo": "Pizza Casera",
    "descripcion": "Pizza italiana",
    "imagen_key": "pizza.jpg",
    "tiempo_coccion": 30,
    "dificultad": "Media",
    "calorias": 600,
    "porciones": 4,
    "is_public": true,
    "usuario_id": 1
  }
}
```

### Error

```json
{
  "success": false,
  "message": "No se pudo crear la receta"
}
```

---

## Eliminar receta

🔒 Requiere autenticación.

### Endpoint

```http
DELETE /recipes/:recipeId
```

### Parámetros

| Nombre   | Tipo   |
| -------- | ------ |
| recipeId | number |

### Ejemplo

```http
DELETE /recipes/15
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 15
  }
}
```

### Error

```json
{
  "success": false,
  "message": "No se encontró la receta o no pertenece al usuario"
}
```

---

# Perfil de Usuario

🔒 Requiere autenticación.

## Actualizar perfil

### Endpoint

```http
PUT /profile
```

### Request

```json
{
  "nombre": "Juan Perez",
  "gmail": "juan@gmail.com"
}
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Juan Perez",
      "email": "juan@gmail.com",
      "avatar": null
    }
  ]
}
```

---

## Actualizar contraseña

🔒 Requiere autenticación.

### Endpoint

```http
PUT /password
```

### Request

```json
{
  "password": "NuevaPassword123"
}
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1
    }
  ]
}
```

### Error

```json
{
  "success": false,
  "message": "No se pudo actualizar la contraseña"
}
```

---

# Códigos HTTP utilizados

| Código | Descripción                |
| ------ | -------------------------- |
| 200    | Operación exitosa          |
| 201    | Recurso creado             |
| 400    | Datos inválidos            |
| 401    | No autenticado             |
| 404    | Recurso no encontrado      |
| 500    | Error interno del servidor |

---

# Modelo de Datos

## Usuario

```json
{
  "id": 1,
  "nombre": "Juan Perez",
  "gmail": "usuario@gmail.com",
  "avatar": null
}
```

## Receta

```json
{
  "id": 1,
  "titulo": "Pizza Casera",
  "descripcion": "Pizza italiana",
  "imagen_key": "pizza.jpg",
  "tiempo_coccion": 30,
  "dificultad": "Media",
  "calorias": 600,
  "porciones": 4,
  "is_public": true,
  "usuario_id": 1
}
```

## Ingrediente

```json
{
  "id": 1,
  "nombre": "Harina",
  "cantidad": "500g",
  "orden": 1
}
```

## Paso

```json
{
  "id": 1,
  "descripcion": "Preparar masa",
  "orden": 1
}
```

## Grupo

```json
{
  "id": 1,
  "nombre": "Comidas Italianas",
  "descripcion": "Recetas italianas",
  "receta_count": 12
}
```

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

# API de Recetas

## Base URL

```http
/api/recipes
```

## Autenticación

Las rutas protegidas requieren una sesión válida generada mediante `login`.

---

# Autenticación

## Login

Inicia sesión y crea una sesión para el usuario.

### Endpoint

```http
POST /login
```

### Request

```json
{
  "gmail": "usuario@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Juan Perez",
    "gmail": "usuario@gmail.com",
    "avatar": null
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

## Register

Registra un nuevo usuario.

### Endpoint

```http
POST /register
```

### Request

```json
{
  "nombre": "Juan Perez",
  "gmail": "usuario@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Juan Perez",
    "email": "usuario@gmail.com",
    "avatar": null
  }
}
```

---

## Logout

Finaliza la sesión actual.

### Endpoint

```http
POST /logout
```

### Response

```json
{
  "success": true
}
```

---

# Recetas Públicas

## Obtener recetas públicas

Devuelve todas las recetas marcadas como públicas.

### Endpoint

```http
GET /public-recipes
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Pizza Casera",
      "descripcion": "Pizza italiana",
      "imagen_key": "pizza.jpg",
      "tiempo_coccion": 30,
      "dificultad": "Media",
      "calorias": 600,
      "porciones": 4,
      "is_public": true,
      "usuario_id": 1,
      "created_at": "2025-01-01T12:00:00.000Z"
    }
  ]
}
```

---

# Recetas del Usuario

🔒 Requiere autenticación.

## Obtener recetas de un usuario

### Endpoint

```http
GET /users/:usuarioId/recipes
```

### Parámetros

| Nombre    | Tipo   | Descripción    |
| --------- | ------ | -------------- |
| usuarioId | number | ID del usuario |

### Ejemplo

```http
GET /users/1/recipes
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Pizza Casera",
      "descripcion": "Pizza italiana",
      "imagen_key": "pizza.jpg",
      "tiempo_coccion": 30,
      "dificultad": "Media",
      "calorias": 600,
      "porciones": 4,
      "is_public": true,
      "usuario_id": 1,
      "created_at": "2025-01-01T12:00:00.000Z"
    }
  ]
}
```

### Error

```json
{
  "success": false,
  "message": "Usuario inválido"
}
```

---

# Recetas

## Obtener detalle de una receta

### Endpoint

```http
GET /recipes/:recipeId
```

### Parámetros

| Nombre   | Tipo   |
| -------- | ------ |
| recipeId | number |

### Response

```json
{
  "success": true,
  "data": {
    "id": 5,
    "titulo": "Pizza Casera",
    "descripcion": "Pizza tradicional italiana",
    "imagen_key": "pizza.jpg",
    "tiempo_coccion": 30,
    "dificultad": "Media",
    "calorias": 600,
    "porciones": 4,
    "is_public": true,
    "usuario_id": 1,
    "ingredientes": [
      {
        "id": 1,
        "nombre": "Harina",
        "cantidad": "500g",
        "orden": 1
      }
    ],
    "pasos": [
      {
        "id": 1,
        "descripcion": "Mezclar ingredientes",
        "orden": 1
      }
    ]
  }
}
```

### Error

```json
{
  "success": false,
  "message": "Receta no encontrada"
}
```

---

## Crear receta

🔒 Requiere autenticación.

### Endpoint

```http
POST /recipes
```

### Request

```json
{
  "titulo": "Pizza Casera",
  "descripcion": "Pizza italiana",
  "imagen_key": "pizza.jpg",
  "tiempo_coccion": 30,
  "dificultad": "Media",
  "calorias": 600,
  "porciones": 4,
  "is_public": true,
  "ingredients": [
    {
      "nombre": "Harina",
      "cantidad": "500g"
    },
    {
      "nombre": "Queso",
      "cantidad": "250g"
    }
  ],
  "steps": [
    {
      "descripcion": "Preparar masa"
    },
    {
      "descripcion": "Hornear"
    }
  ],
  "wantsGroup": true,
  "groupId": 1
}
```

### Campos

| Campo          | Tipo    | Requerido |
| -------------- | ------- | --------- |
| titulo         | string  | Sí        |
| descripcion    | string  | Sí        |
| imagen_key     | string  | Sí        |
| tiempo_coccion | number  | Sí        |
| dificultad     | string  | Sí        |
| calorias       | number  | Sí        |
| porciones      | number  | Sí        |
| is_public      | boolean | Sí        |
| ingredients    | array   | Sí        |
| steps          | array   | Sí        |
| wantsGroup     | boolean | No        |
| groupId        | number  | No        |

### Response

```json
{
  "success": true,
  "data": {
    "id": 15,
    "titulo": "Pizza Casera",
    "descripcion": "Pizza italiana",
    "imagen_key": "pizza.jpg",
    "tiempo_coccion": 30,
    "dificultad": "Media",
    "calorias": 600,
    "porciones": 4,
    "is_public": true,
    "usuario_id": 1
  }
}
```

### Error

```json
{
  "success": false,
  "message": "No se pudo crear la receta"
}
```

---

## Eliminar receta

🔒 Requiere autenticación.

### Endpoint

```http
DELETE /recipes/:recipeId
```

### Parámetros

| Nombre   | Tipo   |
| -------- | ------ |
| recipeId | number |

### Ejemplo

```http
DELETE /recipes/15
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 15
  }
}
```

### Error

```json
{
  "success": false,
  "message": "No se encontró la receta o no pertenece al usuario"
}
```

---

# Perfil de Usuario

🔒 Requiere autenticación.

## Actualizar perfil

### Endpoint

```http
PUT /profile
```

### Request

```json
{
  "nombre": "Juan Perez",
  "gmail": "juan@gmail.com"
}
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Juan Perez",
      "email": "juan@gmail.com",
      "avatar": null
    }
  ]
}
```

---

## Actualizar contraseña

🔒 Requiere autenticación.

### Endpoint

```http
PUT /password
```

### Request

```json
{
  "password": "NuevaPassword123"
}
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1
    }
  ]
}
```

### Error

```json
{
  "success": false,
  "message": "No se pudo actualizar la contraseña"
}
```

---

# Grupos

🔒 Todos los endpoints requieren autenticación.

Los grupos permiten organizar recetas. Un usuario es propietario de un grupo y puede agregar o quitar recetas del mismo.

---

## Obtener grupos del usuario

### Endpoint

```http
GET /users/:usuarioId/groups
```

### Parámetros

| Nombre    | Tipo   | Descripción                              |
| --------- | ------ | ---------------------------------------- |
| usuarioId | number | ID del usuario propietario de los grupos |

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Comidas Italianas",
      "descripcion": "Recetas de Italia",
      "receta_count": 12
    }
  ]
}
```

---

## Crear grupo

### Endpoint

```http
POST /groups
```

### Body

```json
{
  "nombre": "Comidas Italianas",
  "descripcion": "Recetas típicas italianas"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Comidas Italianas",
    "descripcion": "Recetas típicas italianas",
    "usuario_id": 1
  }
}
```

---

## Obtener recetas de un grupo

### Endpoint

```http
GET /groups/:groupId/recipes
```

### Parámetros

| Nombre  | Tipo   | Descripción  |
| ------- | ------ | ------------ |
| groupId | number | ID del grupo |

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "titulo": "Pizza Margarita",
      "descripcion": "Pizza tradicional italiana",
      "usuario_id": 1
    }
  ]
}
```

---

## Agregar receta a un grupo

### Endpoint

```http
POST /groups/:groupId/recipes
```

### Body

```json
{
  "recipeId": 10
}
```

### Response

```json
{
  "success": true,
  "data": {
    "receta_id": 10,
    "grupo_id": 1
  }
}
```

---

## Eliminar una receta del grupo

### Endpoint

```http
DELETE /groups/:groupId/recipes/:recipeId
```

### Parámetros

| Nombre   | Tipo   | Descripción     |
| -------- | ------ | --------------- |
| groupId  | number | ID del grupo    |
| recipeId | number | ID de la receta |

### Response

```json
{
  "success": true,
  "data": {
    "receta_id": 10,
    "grupo_id": 1
  }
}
```

### Restricciones

- Sólo el propietario del grupo puede eliminar recetas del grupo.
- La receta no se elimina de la base de datos.
- Únicamente se elimina la relación entre la receta y el grupo.

---

## Eliminar grupo

### Endpoint

```http
DELETE /groups/:groupId
```

### Parámetros

| Nombre  | Tipo   | Descripción  |
| ------- | ------ | ------------ |
| groupId | number | ID del grupo |

### Comportamiento

Al eliminar un grupo:

1. Se eliminan todas las recetas pertenecientes al propietario que estén asociadas al grupo.
2. Las recetas de otros usuarios no se eliminan.
3. Se elimina el grupo.
4. Las relaciones en `receta_grupo` se eliminan automáticamente mediante `ON DELETE CASCADE`.

### Response

```json
{
  "success": true,
  "data": {
    "id": 1
  }
}
```

### Errores

```json
{
  "success": false,
  "message": "No se encontró el grupo o no pertenece al usuario"
}
```

---

# Códigos HTTP utilizados

| Código | Descripción                |
| ------ | -------------------------- |
| 200    | Operación exitosa          |
| 201    | Recurso creado             |
| 400    | Datos inválidos            |
| 401    | No autenticado             |
| 404    | Recurso no encontrado      |
| 500    | Error interno del servidor |

---

# Modelo de Datos

## Usuario

```json
{
  "id": 1,
  "nombre": "Juan Perez",
  "gmail": "usuario@gmail.com",
  "avatar": null
}
```

## Receta

```json
{
  "id": 1,
  "titulo": "Pizza Casera",
  "descripcion": "Pizza italiana",
  "imagen_key": "pizza.jpg",
  "tiempo_coccion": 30,
  "dificultad": "Media",
  "calorias": 600,
  "porciones": 4,
  "is_public": true,
  "usuario_id": 1
}
```

## Ingrediente

```json
{
  "id": 1,
  "nombre": "Harina",
  "cantidad": "500g",
  "orden": 1
}
```

## Paso

```json
{
  "id": 1,
  "descripcion": "Preparar masa",
  "orden": 1
}
```

## Grupo

```json
{
  "id": 1,
  "nombre": "Comidas Italianas",
  "descripcion": "Recetas italianas",
  "receta_count": 12
}
```
