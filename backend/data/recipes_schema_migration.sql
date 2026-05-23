-- Migración idempotente para el esquema de recetas y grupos

ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT 'https://ui-avatars.com/api/?background=F4C95D&color=1B1B1B&bold=true';

ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS recetas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    imagen_key VARCHAR(50) DEFAULT 'default',
    tiempo_coccion INTEGER CHECK (tiempo_coccion > 0),
    dificultad VARCHAR(20) CHECK (dificultad IN ('Easy', 'Medium', 'Hard', 'Beginner', 'Intermediate')),
    calorias INTEGER CHECK (calorias >= 0),
    porciones INTEGER DEFAULT 1 CHECK (porciones >= 1),
    is_public BOOLEAN DEFAULT FALSE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ingredientes (
    id SERIAL PRIMARY KEY,
    receta_id INTEGER NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    cantidad VARCHAR(100),
    orden INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS pasos (
    id SERIAL PRIMARY KEY,
    receta_id INTEGER NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    descripcion TEXT NOT NULL,
    orden INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS grupos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS receta_grupo (
    receta_id INTEGER NOT NULL REFERENCES recetas(id) ON DELETE CASCADE,
    grupo_id INTEGER NOT NULL REFERENCES grupos(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (receta_id, grupo_id)
);

CREATE INDEX IF NOT EXISTS idx_usuarios_gmail ON usuarios(gmail);
CREATE INDEX IF NOT EXISTS idx_usuarios_created_at ON usuarios(created_at);
CREATE INDEX IF NOT EXISTS idx_recetas_usuario ON recetas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_recetas_titulo ON recetas(titulo);
CREATE INDEX IF NOT EXISTS idx_recetas_is_public ON recetas(is_public);
CREATE INDEX IF NOT EXISTS idx_recetas_dificultad ON recetas(dificultad);
CREATE INDEX IF NOT EXISTS idx_recetas_tiempo ON recetas(tiempo_coccion);
CREATE INDEX IF NOT EXISTS idx_recetas_created_at ON recetas(created_at);
CREATE INDEX IF NOT EXISTS idx_recetas_public_not_user ON recetas(is_public, usuario_id);
CREATE INDEX IF NOT EXISTS idx_ingredientes_receta ON ingredientes(receta_id);
CREATE INDEX IF NOT EXISTS idx_ingredientes_nombre ON ingredientes(nombre);
CREATE INDEX IF NOT EXISTS idx_pasos_receta ON pasos(receta_id);
CREATE INDEX IF NOT EXISTS idx_grupos_usuario ON grupos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_grupos_nombre ON grupos(nombre);
CREATE INDEX IF NOT EXISTS idx_receta_grupo_receta ON receta_grupo(receta_id);
CREATE INDEX IF NOT EXISTS idx_receta_grupo_grupo ON receta_grupo(grupo_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_usuarios_updated_at'
    ) THEN
        CREATE TRIGGER update_usuarios_updated_at
            BEFORE UPDATE ON usuarios
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_recetas_updated_at'
    ) THEN
        CREATE TRIGGER update_recetas_updated_at
            BEFORE UPDATE ON recetas
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'update_grupos_updated_at'
    ) THEN
        CREATE TRIGGER update_grupos_updated_at
            BEFORE UPDATE ON grupos
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END;
$$;
