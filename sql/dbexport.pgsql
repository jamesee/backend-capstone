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
-- Name: my_roles; Type: TYPE; Schema: public; Owner: james
--

CREATE TYPE public.my_roles AS ENUM (
    'creator',
    'collaborator',
    'read-only'
);


ALTER TYPE public.my_roles OWNER TO james;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: access_controls; Type: TABLE; Schema: public; Owner: james
--

CREATE TABLE public.access_controls (
    access_id integer NOT NULL,
    todo_id integer NOT NULL,
    user_id integer NOT NULL,
    role public.my_roles NOT NULL,
    create_at date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.access_controls OWNER TO james;

--
-- Name: access_controls_access_id_seq; Type: SEQUENCE; Schema: public; Owner: james
--

CREATE SEQUENCE public.access_controls_access_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.access_controls_access_id_seq OWNER TO james;

--
-- Name: access_controls_access_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: james
--

ALTER SEQUENCE public.access_controls_access_id_seq OWNED BY public.access_controls.access_id;


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: james
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


ALTER TABLE public.tasks OWNER TO james;

--
-- Name: tasks_task_id_seq; Type: SEQUENCE; Schema: public; Owner: james
--

CREATE SEQUENCE public.tasks_task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tasks_task_id_seq OWNER TO james;

--
-- Name: tasks_task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: james
--

ALTER SEQUENCE public.tasks_task_id_seq OWNED BY public.tasks.task_id;


--
-- Name: todos; Type: TABLE; Schema: public; Owner: james
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


ALTER TABLE public.todos OWNER TO james;

--
-- Name: todos_todo_id_seq; Type: SEQUENCE; Schema: public; Owner: james
--

CREATE SEQUENCE public.todos_todo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.todos_todo_id_seq OWNER TO james;

--
-- Name: todos_todo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: james
--

ALTER SEQUENCE public.todos_todo_id_seq OWNED BY public.todos.todo_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: james
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(50) NOT NULL,
    password_hash character varying(100) NOT NULL,
    create_at date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.users OWNER TO james;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: james
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO james;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: james
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: access_controls access_id; Type: DEFAULT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.access_controls ALTER COLUMN access_id SET DEFAULT nextval('public.access_controls_access_id_seq'::regclass);


--
-- Name: tasks task_id; Type: DEFAULT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.tasks ALTER COLUMN task_id SET DEFAULT nextval('public.tasks_task_id_seq'::regclass);


--
-- Name: todos todo_id; Type: DEFAULT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.todos ALTER COLUMN todo_id SET DEFAULT nextval('public.todos_todo_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: access_controls; Type: TABLE DATA; Schema: public; Owner: james
--

COPY public.access_controls (access_id, todo_id, user_id, role, create_at) FROM stdin;
4	16	1	creator	2021-09-18
5	17	1	creator	2021-09-18
6	18	1	creator	2021-09-18
7	19	1	creator	2021-09-18
8	20	3	creator	2021-09-18
9	21	3	creator	2021-09-18
10	22	3	creator	2021-09-18
11	23	3	creator	2021-09-18
15	8	1	collaborator	2021-09-18
16	8	3	collaborator	2021-09-18
17	8	1	collaborator	2021-09-18
19	8	1	collaborator	2021-09-18
21	8	1	collaborator	2021-09-18
23	8	3	collaborator	2021-09-18
25	8	3	collaborator	2021-09-18
27	8	1	collaborator	2021-09-18
28	8	1	collaborator	2021-09-18
29	8	3	collaborator	2021-09-18
31	8	3	collaborator	2021-09-18
32	8	1	collaborator	2021-09-18
36	8	1	collaborator	2021-09-18
37	8	3	collaborator	2021-09-18
38	8	1	collaborator	2021-09-18
39	8	1	collaborator	2021-09-18
41	8	3	collaborator	2021-09-18
42	8	1	collaborator	2021-09-18
44	8	3	collaborator	2021-09-18
45	8	2	collaborator	2021-09-18
46	23	2	collaborator	2021-09-18
47	23	3	collaborator	2021-09-18
48	23	3	collaborator	2021-09-18
49	23	2	collaborator	2021-09-18
50	20	2	collaborator	2021-09-18
51	20	3	collaborator	2021-09-18
52	20	2	collaborator	2021-09-18
53	20	3	collaborator	2021-09-18
54	20	2	collaborator	2021-09-18
55	20	3	collaborator	2021-09-18
56	20	3	collaborator	2021-09-18
57	20	2	collaborator	2021-09-18
58	20	2	collaborator	2021-09-18
59	20	3	collaborator	2021-09-18
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: james
--

COPY public.tasks (task_id, todo_id, title, description, updated_by, due_date, is_completed, is_deleted, create_at) FROM stdin;
2	16	test-task	hello world description	james	2021-10-29	f	f	2021-09-18
3	16	test-task	hello world description	james	2021-10-29	f	f	2021-09-18
4	16	test-task	hello world description	james	2021-10-29	f	f	2021-09-18
7	16	test-task	hello world description	james	2021-10-29	f	f	2021-09-18
8	16	test-task	hello world description	james	2021-10-29	f	f	2021-09-18
9	16	test-task	hello world description	james	2021-10-29	f	f	2021-09-18
5	16	task title -updated	hello world description	james	2022-03-01	t	t	2021-09-18
10	20	test-task	hello world description using james1 uid=3	james1	2022-10-29	f	f	2021-09-18
1	16	task title -updated	hello world description	james1	2022-03-01	t	t	2021-09-18
6	16	test-task	hello world description	james	2021-10-29	f	t	2021-09-18
11	20	test-task	hello world description using james1 uid=3	james1	2022-10-29	f	f	2021-09-18
12	20	test-task	hello world description using james1 uid=3	james1	2022-10-29	f	f	2021-09-18
13	20	test-task	hello world description using james1 uid=3	james1	2022-10-29	f	f	2021-09-18
14	20	test-task	hello world description using james1 uid=3	james1	2022-10-29	f	f	2021-09-18
15	20	test-task	hello world description using james1 uid=3	james1	2022-10-29	f	t	2021-09-18
\.


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: james
--

COPY public.todos (todo_id, title, updated_by, due_date, is_completed, is_deleted, create_at) FROM stdin;
8	test-task	james	2021-10-29	f	f	2021-09-18
10	test-task	james	2021-10-29	f	f	2021-09-18
11	test-task	james	2021-10-29	f	f	2021-09-18
12	test-task	james	2021-10-29	f	f	2021-09-18
13	test-task	james	2021-10-29	f	f	2021-09-18
14	test-task	james	2021-10-29	f	f	2021-09-18
15	test-task	james	2021-10-29	f	f	2021-09-18
17	test-task	james	2021-10-29	f	f	2021-09-18
19	test-task	james	2021-10-29	f	f	2021-09-18
16	test-task-updated	james	2022-01-01	t	t	2021-09-18
18	task title -updated	james	2022-02-01	t	f	2021-09-18
20	test-task	james1	2021-10-29	f	f	2021-09-18
21	test-task	james1	2021-10-29	f	f	2021-09-18
22	test-task	james1	2021-10-29	f	f	2021-09-18
23	test-task hello	james1	2021-10-29	f	f	2021-09-18
24	todos - james1	james1	2021-10-29	f	f	2021-09-19
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: james
--

COPY public.users (id, username, email, password_hash, create_at) FROM stdin;
1	james	james.ee.sg@gmail.com	$2b$10$mrmO2Tk5nWyCCgUIfVsiDe6u6xj51uTIuE8.cz4KZBJziVI..mThS	2021-09-18
2	james	james@gmail.com	$2b$10$ZRLsFwgM7e9MEW4MJ1BbLOYSE0xzTCNE4GOII43ZrNDInLEl8KO8q	2021-09-18
3	james1	james1@gmail.com	$2b$10$oVfRLmVyUr4/q6KR4Etu2OWfBogH7muvfUHSD4xREBMBgXINMcipa	2021-09-18
\.


--
-- Name: access_controls_access_id_seq; Type: SEQUENCE SET; Schema: public; Owner: james
--

SELECT pg_catalog.setval('public.access_controls_access_id_seq', 59, true);


--
-- Name: tasks_task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: james
--

SELECT pg_catalog.setval('public.tasks_task_id_seq', 15, true);


--
-- Name: todos_todo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: james
--

SELECT pg_catalog.setval('public.todos_todo_id_seq', 24, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: james
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: access_controls access_controls_pkey; Type: CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.access_controls
    ADD CONSTRAINT access_controls_pkey PRIMARY KEY (access_id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (task_id);


--
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (todo_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: access_controls access_controls_todo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.access_controls
    ADD CONSTRAINT access_controls_todo_id_fkey FOREIGN KEY (todo_id) REFERENCES public.todos(todo_id) ON DELETE CASCADE;


--
-- Name: access_controls access_controls_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.access_controls
    ADD CONSTRAINT access_controls_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tasks tasks_todo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: james
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_todo_id_fkey FOREIGN KEY (todo_id) REFERENCES public.todos(todo_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

