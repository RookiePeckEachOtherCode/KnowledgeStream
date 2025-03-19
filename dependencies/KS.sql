-- 清理
DROP TABLE IF EXISTS user_course CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS KS.authority_enum CASCADE;
DROP SCHEMA IF EXISTS KS CASCADE;

CREATE SCHEMA KS;

CREATE TYPE KS.authority_enum AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

CREATE TABLE KS.users (
    id        BIGINT                   NOT NULL PRIMARY KEY,
    avatar    TEXT                     DEFAULT '',
    salt      BYTEA                    NOT NULL,
    password  BYTEA                    NOT NULL,
    name      TEXT,
    phone     TEXT UNIQUE,
    authority KS.authority_enum        DEFAULT 'USER' NOT NULL,
    grade     TEXT
);

CREATE TABLE KS.courses (
    id          BIGINT  NOT NULL PRIMARY KEY,
    title       TEXT    NOT NULL,
    description TEXT    DEFAULT '',
    cover       TEXT    DEFAULT '',
    ascription  BIGINT,
    begin_time  TEXT,
    end_time    TEXT
);

CREATE TABLE KS.videos (
    id          BIGINT  NOT NULL PRIMARY KEY,
    source      TEXT,
    title       TEXT    NOT NULL,
    description TEXT    DEFAULT '',
    uploader    BIGINT,
    length      INTEGER,
    cover       TEXT    NOT NULL,
    ascription  BIGINT  REFERENCES KS.courses(id),
    upload_time TEXT
);

CREATE TABLE KS.user_course (
    uid BIGINT NOT NULL REFERENCES KS.users(id),
    cid BIGINT NOT NULL REFERENCES KS.courses(id),
    PRIMARY KEY (uid, cid)
);

ALTER SCHEMA KS OWNER TO postgres;
ALTER TYPE KS.authority_enum OWNER TO postgres;
ALTER TABLE KS.users OWNER TO postgres;
ALTER TABLE KS.courses OWNER TO postgres;
ALTER TABLE KS.videos OWNER TO postgres;
ALTER TABLE KS.user_course OWNER TO postgres;
