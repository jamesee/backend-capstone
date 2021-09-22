--
-- PostgreSQL database dump
--

-- Dumped from database version 13.4 (Debian 13.4-1.pgdg100+1)
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
-- Name: my_roles; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.my_roles AS ENUM (
    'creator',
    'collaborator',
    'read-only'
);


ALTER TYPE public.my_roles OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: access_controls; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.access_controls (
    access_id integer NOT NULL,
    todo_id integer NOT NULL,
    user_id integer NOT NULL,
    role public.my_roles NOT NULL,
    create_at date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.access_controls OWNER TO postgres;

--
-- Name: access_controls_access_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.access_controls_access_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.access_controls_access_id_seq OWNER TO postgres;

--
-- Name: access_controls_access_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.access_controls_access_id_seq OWNED BY public.access_controls.access_id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: tasks_task_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tasks_task_id_seq OWNER TO postgres;

--
-- Name: tasks_task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tasks_task_id_seq OWNED BY public.tasks.task_id;


--
-- Name: todos; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.todos OWNER TO postgres;

--
-- Name: todos_todo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.todos_todo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.todos_todo_id_seq OWNER TO postgres;

--
-- Name: todos_todo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.todos_todo_id_seq OWNED BY public.todos.todo_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(50) NOT NULL,
    password_hash character varying(100) NOT NULL,
    create_at date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: access_controls access_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_controls ALTER COLUMN access_id SET DEFAULT nextval('public.access_controls_access_id_seq'::regclass);


--
-- Name: tasks task_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN task_id SET DEFAULT nextval('public.tasks_task_id_seq'::regclass);


--
-- Name: todos todo_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todos ALTER COLUMN todo_id SET DEFAULT nextval('public.todos_todo_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: access_controls; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.access_controls (access_id, todo_id, user_id, role, create_at) FROM stdin;
2	2	2	creator	2021-09-22
3	3	2	creator	2021-09-22
4	4	2	creator	2021-09-22
5	5	2	creator	2021-09-22
11	11	3	creator	2021-09-22
12	12	3	creator	2021-09-22
13	13	3	creator	2021-09-22
14	14	3	creator	2021-09-22
15	15	3	creator	2021-09-22
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (task_id, todo_id, title, description, updated_by, due_date, is_completed, is_deleted, create_at) FROM stdin;
3	2	test-task	hello world description using james1	james1	2022-10-18	f	f	2021-09-22
4	2	test-task	hello world description using james1	james1	2022-10-18	f	f	2021-09-22
5	2	test-task	hello world description using james1	james1	2022-10-18	f	f	2021-09-22
6	2	test-task	hello world description using james1	james1	2022-10-18	f	f	2021-09-22
12	15	test-task	hello world description using james2	james2	2022-10-18	f	f	2021-09-22
13	15	test-task	hello world description using james2	james2	2022-10-18	f	f	2021-09-22
14	15	test-task	hello world description using james2	james2	2022-10-18	f	f	2021-09-22
15	15	test-task	hello world description using james2	james2	2022-10-18	f	f	2021-09-22
16	15	test-task	hello world description using james2	james2	2022-10-18	f	f	2021-09-22
2	2	task title -updated	description - updated again - james1	james1	2022-03-01	t	t	2021-09-22
\.


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.todos (todo_id, title, updated_by, due_date, is_completed, is_deleted, create_at) FROM stdin;
2	test-task hello -james1	james1	2021-10-18	f	f	2021-09-22
3	test-task hello -james1	james1	2021-10-18	f	f	2021-09-22
4	test-task hello -james1	james1	2021-10-18	f	f	2021-09-22
5	test-task hello -james1	james1	2021-10-18	f	f	2021-09-22
11	test-task hello -james2	james2	2021-10-18	f	f	2021-09-22
12	test-task hello -james2	james2	2021-10-18	f	f	2021-09-22
13	test-task hello -james2	james2	2021-10-18	f	f	2021-09-22
14	test-task hello -james2	james2	2021-10-18	f	f	2021-09-22
15	test-task hello -james2	james2	2021-10-18	f	f	2021-09-22
1	task-updated - james1	james1	2022-02-01	t	t	2021-09-22
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash, create_at) FROM stdin;
2	james1	james1@gmail.com	$2b$10$HjR7an8uBgMu3lBPwf3waOPAHvTGg4NSRf4Y/1DyzbcuFGgxbhkyC	2021-09-22
3	james2	james2@gmail.com	$2b$10$luCS5MGiOVJALohjW6rrpOS79K7hj4kt3oULjY.3HGn5D5VMYs2RC	2021-09-22
4	james3	james3@gmail.com	$2b$10$KBVFh25HAPAbHFMpPYsDpO.8K3eNAalPOGF647jSnDB/lFYNneAsK	2021-09-22
5	james4	james4@gmail.com	$2b$10$mh7P8kFqpcYQP.vxrkGc9.C1RIFgdXuqxLV02n4hFJAXnDH0/8.q6	2021-09-22
6	james5	james5@gmail.com	$2b$10$Edh09twgkG9UHRQx/LkaZOPVZaT0dbj42t/ZiMlwYzgj06W6feXTa	2021-09-22
\.


--
-- Name: access_controls_access_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.access_controls_access_id_seq', 15, true);


--
-- Name: tasks_task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_task_id_seq', 16, true);


--
-- Name: todos_todo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.todos_todo_id_seq', 15, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: access_controls access_controls_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_controls
    ADD CONSTRAINT access_controls_pkey PRIMARY KEY (access_id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (task_id);


--
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (todo_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: access_controls access_controls_todo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_controls
    ADD CONSTRAINT access_controls_todo_id_fkey FOREIGN KEY (todo_id) REFERENCES public.todos(todo_id) ON DELETE CASCADE;


--
-- Name: access_controls access_controls_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_controls
    ADD CONSTRAINT access_controls_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_todo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_todo_id_fkey FOREIGN KEY (todo_id) REFERENCES public.todos(todo_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

