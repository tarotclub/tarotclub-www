DROP DATABASE IF EXISTS tarotclubdb;
CREATE DATABASE tarotclubdb;

\c tarotclubdb;

CREATE TABLE IF NOT EXISTS users (
    id bigserial PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    attr JSON, -- autres paramètres en vrac (nom complet, twitter, fb, ...)
    created timestamp, -- when the account was created
    reset_password_datetime timestamp,
    login_attempts INTEGER,
    reset_token TEXT -- reset password token
);


CREATE TABLE IF NOT EXISTS infos
(
    version TEXT
);


