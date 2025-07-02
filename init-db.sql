-- Создание базы данных
CREATE DATABASE short_links_db;

-- Подключение к созданной базе данных
\c short_links_db;

-- Создание расширения для UUID (если используется)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";