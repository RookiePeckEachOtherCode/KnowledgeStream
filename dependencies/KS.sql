CREATE TYPE authority_enum AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');
create table "user"
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

alter table "user"
    owner to root;

create table course
(
    id          bigint not null
        constraint course_pk
            primary key,
    title       text,
    description text,
    cover       text,
    ascription  bigint
);

alter table course
    owner to root;

create table video
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
            references course
);

alter table video
    owner to root;

create table user_course
(
    uid bigint not null
        constraint user_course_user_id_fk
            references "user",
    cid bigint not null
        constraint user_course_course_id_fk
            references course,
    constraint user_course_pk
        primary key (uid, cid)
);

alter table user_course
    owner to root;

