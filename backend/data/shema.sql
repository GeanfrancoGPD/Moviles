CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(30),
  gmail VARCHAR(150) UNIQUE,
  password VARCHAR(32)
);

CREATE TABLE notas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200),
  contenido TEXT,
  usuario_id INTEGER REFERENCES usuarios(id)
);

