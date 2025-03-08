CREATE TYPE authority_enum AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');
create table "users"
(
    id        bigint             not null
        constraint user_pk
            primary key,
    avatar    text,
    salt      bytea,
    password  bytea,
    name      text,
    phone     text,
    authority authority_enum default 'USER' not null
);

alter table "users"
    owner to root;

create table courses
(
    id          bigint not null
        constraint course_pk
            primary key,
    title       text,
    description text,
    cover       text,
    ascription  bigint
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
    length      integer,
    cover       text,
    ascription  bigint
        constraint video_course_id_fk
            references courses
);

alter table videos
    owner to root;

create table user_course
(
    uid bigint not null
        constraint user_course_user_id_fk
            references "users",
    cid bigint not null
        constraint user_course_course_id_fk
            references courses,
    constraint user_course_pk
        primary key (uid, cid)
);

alter table user_course
    owner to root;

