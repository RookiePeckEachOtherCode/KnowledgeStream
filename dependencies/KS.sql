create table users
(
    id        bigint                                        not null
        constraint user_pk
            primary key,
    avatar    text           default ''::text,
    salt      bytea                                         not null,
    password  bytea                                         not null,
    name      text,
    phone     text
        unique,
    authority authority_enum default 'USER'::authority_enum not null,
    grade     text
);

alter table users
    owner to postgres;

create table courses
(
    id          bigint not null
        constraint course_pk
            primary key,
    title       text   not null,
    description text default ''::text,
    cover       text default ''::text,
    ascription  bigint,
    begin_time  text,
    end_time    text
);

alter table courses
    owner to postgres;

create table videos
(
    id          bigint not null
        constraint video_pk
            primary key,
    source      text,
    title       text   not null,
    description text default ''::text,
    uploader    bigint,
    length      integer,
    cover       text   not null,
    ascription  bigint
        constraint video_course_id_fk
            references courses,
    upload_time text
);

alter table videos
    owner to postgres;

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
    owner to postgres;