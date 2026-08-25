CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- disimpan dalam bentuk hash (bcrypt)
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE api_keys (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key VARCHAR(64) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE regions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  island VARCHAR(100)
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE destinations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES categories(id),
  region_id INTEGER REFERENCES regions(id),
  city VARCHAR(100),
  rating DECIMAL(2,1),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index buat mempercepat lookup API key saat validasi (dipanggil di tiap request)
CREATE INDEX idx_api_keys_key ON api_keys(key);
