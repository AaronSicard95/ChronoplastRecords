INSERT INTO users (username, password, email, handle, isAdmin)
VALUES ('admin',
        '$2b$04$qfw3l8XAHtbxc6DVKmlD4.J/ScNweO7oZ3s2iw8vKlFInboNsQSwu',
        'admin@chronoplast.com',
        'admin',
        TRUE);
INSERT INTO bands (name, bio, id, imageURL)
VALUES ('Cool Band',
        'Coolguys',
        1,
        '/images/NoImage.jpg');
INSERT INTO records (title, band_id, imageURL)
VALUES ('New Record',
        1,
        '/images/NoImage.jpg');