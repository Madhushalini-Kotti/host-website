DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    age INTEGER
);

INSERT INTO users (username, age) VALUES ('Madhushalini', 23), ('Vikas Reddy', 25);