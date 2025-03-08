CREATE TYPE authority_enum AS ENUM('USER', 'ADMIN', 'SUPER_ADMIN');

CREATE TABLE "users" (
    id BIGINT NOT NULL CONSTRAINT user_pk PRIMARY KEY,
    avatar TEXT DEFAULT '',
    salt bytea NOT NULL,
    PASSWORD bytea NOT NULL,
    NAME TEXT,
    phone TEXT UNIQUE,
    authority authority_enum DEFAULT 'USER' NOT NULL
  );

CREATE TABLE courses (
    id BIGINT NOT NULL CONSTRAINT course_pk PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    cover TEXT DEFAULT '',
    ascription BIGINT
);

CREATE TABLE videos (
    id BIGINT NOT NULL CONSTRAINT video_pk PRIMARY KEY,
    source TEXT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    uploader BIGINT,
    length INTEGER,
    cover TEXT NOT NULL,
    ascription BIGINT CONSTRAINT video_course_id_fk REFERENCES courses
);

CREATE TABLE user_course (
    uid BIGINT NOT NULL CONSTRAINT user_course_user_id_fk REFERENCES "users",
    cid BIGINT NOT NULL CONSTRAINT user_course_course_id_fk REFERENCES courses,
    CONSTRAINT user_course_pk PRIMARY KEY (uid, cid)
);