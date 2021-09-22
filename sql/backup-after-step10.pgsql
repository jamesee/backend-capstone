
drop table tasks;
drop table access_controls;
drop table todos;
drop table users;
drop type my_roles;

--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4 (Ubuntu 13.4-1.pgdg20.04+1)
-- Dumped by pg_dump version 13.4 (Debian 13.4-1.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: my_roles; Type: TYPE; Schema: public; Owner: zvjmbyktodziqt
--

CREATE TYPE public.my_roles AS ENUM (
    'creator',
    'collaborator',
    'read-only'
);


ALTER TYPE public.my_roles OWNER TO zvjmbyktodziqt;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: access_controls; Type: TABLE; Schema: public; Owner: zvjmbyktodziqt
--

CREATE TABLE public.access_controls (
    access_id integer NOT NULL,
    todo_id integer NOT NULL,
    user_id integer NOT NULL,
    role public.my_roles NOT NULL,
    create_at date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.access_controls OWNER TO zvjmbyktodziqt;

--
-- Name: access_controls_access_id_seq; Type: SEQUENCE; Schema: public; Owner: zvjmbyktodziqt
--

CREATE SEQUENCE public.access_controls_access_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.access_controls_access_id_seq OWNER TO zvjmbyktodziqt;

--
-- Name: access_controls_access_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zvjmbyktodziqt
--

ALTER SEQUENCE public.access_controls_access_id_seq OWNED BY public.access_controls.access_id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: zvjmbyktodziqt
--

CREATE TABLE public.tasks (
    task_id integer NOT NULL,
    todo_id integer NOT NULL,
    title character varying(128) NOT NULL,
    description character varying(255) NOT NULL,
    updated_by character varying(100) NOT NULL,
    due_date date NOT NULL,
    is_completed boolean NOT NULL,
    is_deleted boolean NOT NULL,
    create_at date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.tasks OWNER TO zvjmbyktodziqt;

--
-- Name: tasks_task_id_seq; Type: SEQUENCE; Schema: public; Owner: zvjmbyktodziqt
--

CREATE SEQUENCE public.tasks_task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tasks_task_id_seq OWNER TO zvjmbyktodziqt;

--
-- Name: tasks_task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zvjmbyktodziqt
--

ALTER SEQUENCE public.tasks_task_id_seq OWNED BY public.tasks.task_id;


--
-- Name: todos; Type: TABLE; Schema: public; Owner: zvjmbyktodziqt
--

CREATE TABLE public.todos (
    todo_id integer NOT NULL,
    title character varying(128) NOT NULL,
    updated_by character varying(100) NOT NULL,
    due_date date NOT NULL,
    is_completed boolean NOT NULL,
    is_deleted boolean NOT NULL,
    create_at date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.todos OWNER TO zvjmbyktodziqt;

--
-- Name: todos_todo_id_seq; Type: SEQUENCE; Schema: public; Owner: zvjmbyktodziqt
--

CREATE SEQUENCE public.todos_todo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.todos_todo_id_seq OWNER TO zvjmbyktodziqt;

--
-- Name: todos_todo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zvjmbyktodziqt
--

ALTER SEQUENCE public.todos_todo_id_seq OWNED BY public.todos.todo_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: zvjmbyktodziqt
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(50) NOT NULL,
    password_hash character varying(100) NOT NULL,
    create_at date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.users OWNER TO zvjmbyktodziqt;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: zvjmbyktodziqt
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO zvjmbyktodziqt;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: zvjmbyktodziqt
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: access_controls access_id; Type: DEFAULT; Schema: public; Owner: zvjmbyktodziqt
--

ALTER TABLE ONLY public.access_controls ALTER COLUMN access_id SET DEFAULT nextval('public.access_controls_access_id_seq'::regclass);


--
-- Name: tasks task_id; Type: DEFAULT; Schema: public; Owner: zvjmbyktodziqt
--

ALTER TABLE ONLY public.tasks ALTER COLUMN task_id SET DEFAULT nextval('public.tasks_task_id_seq'::regclass);


--
-- Name: todos todo_id; Type: DEFAULT; Schema: public; Owner: zvjmbyktodziqt
--

ALTER TABLE ONLY public.todos ALTER COLUMN todo_id SET DEFAULT nextval('public.todos_todo_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: zvjmbyktodziqt
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: access_controls; Type: TABLE DATA; Schema: public; Owner: zvjmbyktodziqt
--

COPY public.access_controls (access_id, todo_id, user_id, role, create_at) FROM stdin;
2	2	1	creator	2021-09-22
3	3	1	creator	2021-09-22
4	4	1	creator	2021-09-22
5	5	1	creator	2021-09-22
6	6	2	creator	2021-09-22
7	7	2	creator	2021-09-22
8	8	2	creator	2021-09-22
9	9	2	creator	2021-09-22
10	10	2	creator	2021-09-22
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: zvjmbyktodziqt
--

COPY public.tasks (task_id, todo_id, title, description, updated_by, due_date, is_completed, is_deleted, create_at) FROM stdin;
1	2	test-task	hello world description using james1	james1	2022-10-18	f	f	2021-09-22
2	2	test-task	hello world description using james1	james1	2022-10-18	f	f	2021-09-22
3	2	test-task	hello world description using james1	james1	2022-10-18	f	f	2021-09-22
4	2	test-task	hello world description using james1	james1	2022-10-18	f	f	2021-09-22
5	2	test-task	hello world description using james1	james1	2022-10-18	f	f	2021-09-22
6	10	test-task	hello world description using james2	james2	2022-10-18	f	f	2021-09-22
7	10	test-task	hello world description using james2	james2	2022-10-18	f	f	2021-09-22
8	10	test-task	hello world description using james2	james2	2022-10-18	f	f	2021-09-22
9	10	test-task	hello world description using james2	james2	2022-10-18	f	f	2021-09-22
10	10	test-task	hello world description using james2	james2	2022-10-18	f	f	2021-09-22
\.


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: zvjmbyktodziqt
--

COPY public.todos (todo_id, title, updated_by, due_date, is_completed, is_deleted, create_at) FROM stdin;
2	test-task hello -james1	james1	2021-10-18	f	f	2021-09-22
3	test-task hello -james1	james1	2021-10-18	f	f	2021-09-22
4	test-task hello -james1	james1	2021-10-18	f	f	2021-09-22
5	test-task hello -james1	james1	2021-10-18	f	f	2021-09-22
6	test-task hello -james2	james2	2021-10-18	f	f	2021-09-22
7	test-task hello -james2	james2	2021-10-18	f	f	2021-09-22
8	test-task hello -james2	james2	2021-10-18	f	f	2021-09-22
9	test-task hello -james2	james2	2021-10-18	f	f	2021-09-22
10	test-task hello -james2	james2	2021-10-18	f	f	2021-09-22
1	task-updated - james1	james1	2022-02-01	t	t	2021-09-22
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: zvjmbyktodziqt
--

COPY public.users (id, username, email, password_hash, create_at) FROM stdin;
1	james1	james1@gmail.com	$2b$10$YYBx3gErIXsU9t6GW8ExzuqRQthy99IpYDa62X45ej0.zSQf.zRFO	2021-09-22
2	james2	james2@gmail.com	$2b$10$6JMm0mWNPGH7upw6au.D2uuaaS0OIqQGtTf/ShF5KXCAiV1R43zmS	2021-09-22
3	james3	james3@gmail.com	$2b$10$ong0aUqxYa2/PKIFGz7.8OgXTil238IYXv0kSYENHTApjTAehGRwu	2021-09-22
4	james4	james4@gmail.com	$2b$10$I7HbdCcIUjK9dEmfxaP9QOt/sAutkeQH3hYDFR1Jr31HjS1rffYbG	2021-09-22
5	james5	james5@gmail.com	$2b$10$hEH./nuNfYRm/8lSkkxjXuGV6qUb0REfP0PfYLHeYxK1YtlZD6oza	2021-09-22
\.


--
-- Name: access_controls_access_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zvjmbyktodziqt
--

SELECT pg_catalog.setval('public.access_controls_access_id_seq', 10, true);


--
-- Name: tasks_task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zvjmbyktodziqt
--

SELECT pg_catalog.setval('public.tasks_task_id_seq', 10, true);


--
-- Name: todos_todo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zvjmbyktodziqt
--

SELECT pg_catalog.setval('public.todos_todo_id_seq', 10, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: zvjmbyktodziqt
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: access_controls access_controls_pkey; Type: CONSTRAINT; Schema: public; Owner: zvjmbyktodziqt
--

ALTER TABLE ONLY public.access_controls
    ADD CONSTRAINT access_controls_pkey PRIMARY KEY (access_id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: zvjmbyktodziqt
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (task_id);


--
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: zvjmbyktodziqt
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (todo_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: zvjmbyktodziqt
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: access_controls access_controls_todo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zvjmbyktodziqt
--

ALTER TABLE ONLY public.access_controls
    ADD CONSTRAINT access_controls_todo_id_fkey FOREIGN KEY (todo_id) REFERENCES public.todos(todo_id) ON DELETE CASCADE;


--
-- Name: access_controls access_controls_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zvjmbyktodziqt
--

ALTER TABLE ONLY public.access_controls
    ADD CONSTRAINT access_controls_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_todo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: zvjmbyktodziqt
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_todo_id_fkey FOREIGN KEY (todo_id) REFERENCES public.todos(todo_id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: zvjmbyktodziqt
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO zvjmbyktodziqt;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: LANGUAGE plpgsql; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON LANGUAGE plpgsql TO zvjmbyktodziqt;


--
-- PostgreSQL database dump complete
--

