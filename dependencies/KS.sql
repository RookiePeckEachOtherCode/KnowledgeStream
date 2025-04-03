-- 清理
DROP TABLE IF EXISTS user_course CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TYPE IF EXISTS KS.authority_enum CASCADE;
DROP SCHEMA IF EXISTS KS CASCADE;

CREATE SCHEMA KS;

create type authority_enum as enum ('USER', 'ADMIN', 'SUPER_ADMIN');

alter type authority_enum owner to root;

create table notifications
(
    id       bigint not null
        constraint id
            primary key,
    cid      bigint,
    content  text,
    file     text,
    favorite integer default 0,
    title    text
);

alter table notifications
    owner to root;

create table comments
(
    id         bigint not null
        constraint comments_pk
            primary key,
    ascription bigint,
    avatar     text,
    name       text,
    content    text,
    parent     bigint,
    time       text,
    children   integer
);

alter table comments
    owner to root;

create table users
(
    id        bigint                                        not null
        constraint user_pk
            primary key,
    avatar    text,
    salt      bytea,
    password  bytea,
    name      text,
    phone     text,
    authority authority_enum default 'USER'::authority_enum not null,
    grade     text,
    class     text,
    faculty   text,
    major     text,
    signature text
);

alter table users
    owner to root;

create table courses
(
    id          bigint not null
        constraint course_pk
            primary key,
    title       text,
    description text,
    cover       text,
    ascription  bigint,
    begin_time  text,
    end_time    text,
    major       text,
    class       text
);

alter table courses
    owner to root;

create table videos
(
    id          bigint not null
        constraint video_pk
            primary key,
    source      text,
    title       text,
    description text,
    uploader    bigint,
    length      text,
    cover       text,
    ascription  bigint
        constraint video_course_id_fk
            references courses,
    chapter     text,
    upload_time text,
    plays       bigint
);

alter table videos
    owner to root;

create table user_course
(
    uid bigint not null
        constraint user_course_user_id_fk
            references users,
    cid bigint not null
        constraint user_course_course_id_fk
            references courses,
    constraint user_course_pk
        primary key (uid, cid)
);

alter table user_course
    owner to root;

