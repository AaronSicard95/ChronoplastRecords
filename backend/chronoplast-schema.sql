CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  handle TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  isAdmin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE bands(
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    origin TEXT,
    imageURL TEXT DEFAULT 'images/NoImage.jpg',
    bio TEXT
);

CREATE TABLE musicians(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    imageURL TEXT DEFAULT 'images/NoImage.jpg',
    bio TEXT
);

CREATE TABLE records(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    imageURL TEXT DEFAULT 'images/NoImage.jpg',
    band_id INTEGER NOT NULL
        REFERENCES bands(id)
);

CREATE TABLE listings(
    id SERIAL PRIMARY KEY,
    quality TEXT,
    price NUMERIC(10,2),
    stock INTEGER NOT NULL DEFAULT 0,
    imageURL TEXT DEFAULT 'images/NoImage.jpg',
    record_id INTEGER
        REFERENCES records(id)
);

CREATE TABLE genres(
    id SERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE reviews(
    username TEXT
        REFERENCES users ON DELETE CASCADE,
    record_id INTEGER
        REFERENCES records ON DELETE CASCADE,
    rating INTEGER,
    text TEXT,
    PRIMARY KEY (username, record_id)
);

CREATE TABLE genrerecords(
    record_id INTEGER
        REFERENCES records ON DELETE CASCADE,
    genre_id INTEGER
        REFERENCES genres ON DELETE CASCADE,
    PRIMARY KEY (genre_id, record_id)
);

CREATE TABLE bandmemebers(
    band_id INTEGER
        REFERENCES bands(id),
    musician_id INTEGER
        REFERENCES musicians(id),
    PRIMARY KEY(band_id, musician_id)
);

CREATE TABLE genrebands(
    genre_id INTEGER
        REFERENCES genres ON DELETE CASCADE,
    band_id INTEGER
        REFERENCES bands ON DELETE CASCADE,
    PRIMARY KEY(genre_id, band_id)
);

CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    record_id INTEGER,
    username TEXT,
    FOREIGN KEY(record_id) REFERENCES records(id),
    FOREIGN KEY(username) REFERENCES users (username)
);