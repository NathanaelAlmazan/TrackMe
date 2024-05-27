--
-- PostgreSQL database dump
--

-- Dumped from database version 14.11 (Ubuntu 14.11-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.11 (Ubuntu 14.11-0ubuntu0.22.04.1)

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
-- Name: Assignment; Type: TYPE; Schema: public; Owner: birmanila
--

CREATE TYPE public."Assignment" AS ENUM (
    'APPROVER',
    'MEMBER'
);


ALTER TYPE public."Assignment" OWNER TO birmanila;

--
-- Name: Frequency; Type: TYPE; Schema: public; Owner: birmanila
--

CREATE TYPE public."Frequency" AS ENUM (
    'NONE',
    'MONTHLY',
    'YEARLY'
);


ALTER TYPE public."Frequency" OWNER TO birmanila;

--
-- Name: ReportType; Type: TYPE; Schema: public; Owner: birmanila
--

CREATE TYPE public."ReportType" AS ENUM (
    'HR',
    'ADMIN'
);


ALTER TYPE public."ReportType" OWNER TO birmanila;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: birmanila
--

CREATE TYPE public."Role" AS ENUM (
    'CHIEF',
    'DIRECTOR',
    'SUPERUSER',
    'OFFICER',
    'HR_ADMIN'
);


ALTER TYPE public."Role" OWNER TO birmanila;

--
-- Name: Status; Type: TYPE; Schema: public; Owner: birmanila
--

CREATE TYPE public."Status" AS ENUM (
    'REFERRED',
    'ASSIGNED',
    'PROCESSED',
    'SUBMITTED',
    'FINISHED',
    'NOT_ACTIONABLE'
);


ALTER TYPE public."Status" OWNER TO birmanila;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Assigned; Type: TABLE; Schema: public; Owner: birmanila
--

CREATE TABLE public."Assigned" (
    "officerId" uuid NOT NULL,
    "documentId" character varying(50) NOT NULL,
    assignment public."Assignment" DEFAULT 'MEMBER'::public."Assignment" NOT NULL
);


ALTER TABLE public."Assigned" OWNER TO birmanila;

--
-- Name: Comments; Type: TABLE; Schema: public; Owner: birmanila
--

CREATE TABLE public."Comments" (
    id bigint NOT NULL,
    "documentId" character varying(50) NOT NULL,
    recipient uuid NOT NULL,
    sender uuid NOT NULL,
    message text NOT NULL,
    "dateCreated" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Comments" OWNER TO birmanila;

--
-- Name: Comments_id_seq; Type: SEQUENCE; Schema: public; Owner: birmanila
--

CREATE SEQUENCE public."Comments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Comments_id_seq" OWNER TO birmanila;

--
-- Name: Comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: birmanila
--

ALTER SEQUENCE public."Comments_id_seq" OWNED BY public."Comments".id;


--
-- Name: DocumentPurpose; Type: TABLE; Schema: public; Owner: birmanila
--

CREATE TABLE public."DocumentPurpose" (
    id bigint NOT NULL,
    label character varying(100) NOT NULL
);


ALTER TABLE public."DocumentPurpose" OWNER TO birmanila;

--
-- Name: DocumentPurpose_id_seq; Type: SEQUENCE; Schema: public; Owner: birmanila
--

CREATE SEQUENCE public."DocumentPurpose_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."DocumentPurpose_id_seq" OWNER TO birmanila;

--
-- Name: DocumentPurpose_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: birmanila
--

ALTER SEQUENCE public."DocumentPurpose_id_seq" OWNED BY public."DocumentPurpose".id;


--
-- Name: DocumentStatus; Type: TABLE; Schema: public; Owner: birmanila
--

CREATE TABLE public."DocumentStatus" (
    id bigint NOT NULL,
    label character varying(50) NOT NULL,
    category public."Status" NOT NULL
);


ALTER TABLE public."DocumentStatus" OWNER TO birmanila;

--
-- Name: DocumentStatus_id_seq; Type: SEQUENCE; Schema: public; Owner: birmanila
--

CREATE SEQUENCE public."DocumentStatus_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."DocumentStatus_id_seq" OWNER TO birmanila;

--
-- Name: DocumentStatus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: birmanila
--

ALTER SEQUENCE public."DocumentStatus_id_seq" OWNED BY public."DocumentStatus".id;


--
-- Name: DocumentTypes; Type: TABLE; Schema: public; Owner: birmanila
--

CREATE TABLE public."DocumentTypes" (
    id bigint NOT NULL,
    label character varying(100) NOT NULL
);


ALTER TABLE public."DocumentTypes" OWNER TO birmanila;

--
-- Name: DocumentTypes_id_seq; Type: SEQUENCE; Schema: public; Owner: birmanila
--

CREATE SEQUENCE public."DocumentTypes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."DocumentTypes_id_seq" OWNER TO birmanila;

--
-- Name: DocumentTypes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: birmanila
--

ALTER SEQUENCE public."DocumentTypes_id_seq" OWNED BY public."DocumentTypes".id;


--
-- Name: Documents; Type: TABLE; Schema: public; Owner: birmanila
--

CREATE TABLE public."Documents" (
    "referenceNum" character varying(50) NOT NULL,
    subject text NOT NULL,
    description text NOT NULL,
    "receivedFrom" character varying(100) NOT NULL,
    "typeId" bigint,
    "purposeId" bigint,
    "dateCreated" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dateDue" timestamp(3) without time zone NOT NULL,
    tag character varying(20),
    "signatureId" uuid
);


ALTER TABLE public."Documents" OWNER TO birmanila;

--
-- Name: Events; Type: TABLE; Schema: public; Owner: birmanila
--

CREATE TABLE public."Events" (
    id bigint NOT NULL,
    subject text NOT NULL,
    description text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    frequency public."Frequency" NOT NULL,
    image text
);


ALTER TABLE public."Events" OWNER TO birmanila;

--
-- Name: Events_id_seq; Type: SEQUENCE; Schema: public; Owner: birmanila
--

CREATE SEQUENCE public."Events_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Events_id_seq" OWNER TO birmanila;

--
-- Name: Events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: birmanila
--

ALTER SEQUENCE public."Events_id_seq" OWNED BY public."Events".id;


--
-- Name: Officers; Type: TABLE; Schema: public; Owner: birmanila
--

CREATE TABLE public."Officers" (
    uuid uuid NOT NULL,
    "firstName" character varying(50) NOT NULL,
    "lastName" character varying(50) NOT NULL,
    "positionId" bigint,
    "officeId" bigint,
    password text,
    signature text,
    active boolean DEFAULT false NOT NULL,
    device text,
    avatar text DEFAULT '/assets/images/avatars/avatar_30.jpg'::text NOT NULL,
    code character varying(8),
    email character varying(50),
    phone character varying(10),
    verified boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Officers" OWNER TO birmanila;

--
-- Name: Offices; Type: TABLE; Schema: public; Owner: birmanila
--

CREATE TABLE public."Offices" (
    id bigint NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public."Offices" OWNER TO birmanila;

--
-- Name: Offices_id_seq; Type: SEQUENCE; Schema: public; Owner: birmanila
--

CREATE SEQUENCE public."Offices_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Offices_id_seq" OWNER TO birmanila;

--
-- Name: Offices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: birmanila
--

ALTER SEQUENCE public."Offices_id_seq" OWNED BY public."Offices".id;


--
-- Name: Positions; Type: TABLE; Schema: public; Owner: birmanila
--

CREATE TABLE public."Positions" (
    id bigint NOT NULL,
    label character varying(50) NOT NULL,
    role public."Role" NOT NULL
);


ALTER TABLE public."Positions" OWNER TO birmanila;

--
-- Name: Positions_id_seq; Type: SEQUENCE; Schema: public; Owner: birmanila
--

CREATE SEQUENCE public."Positions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Positions_id_seq" OWNER TO birmanila;

--
-- Name: Positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: birmanila
--

ALTER SEQUENCE public."Positions_id_seq" OWNED BY public."Positions".id;


--
-- Name: Referrals; Type: TABLE; Schema: public; Owner: birmanila
--

CREATE TABLE public."Referrals" (
    "documentId" character varying(50) NOT NULL,
    "officeId" bigint NOT NULL,
    "statusId" bigint
);


ALTER TABLE public."Referrals" OWNER TO birmanila;

--
-- Name: Reports; Type: TABLE; Schema: public; Owner: birmanila
--

CREATE TABLE public."Reports" (
    id bigint NOT NULL,
    name text NOT NULL,
    basis text NOT NULL,
    "localDue" timestamp(3) without time zone NOT NULL,
    "nationalDue" timestamp(3) without time zone NOT NULL,
    frequency public."Frequency" NOT NULL,
    type public."ReportType" DEFAULT 'HR'::public."ReportType" NOT NULL
);


ALTER TABLE public."Reports" OWNER TO birmanila;

--
-- Name: Reports_id_seq; Type: SEQUENCE; Schema: public; Owner: birmanila
--

CREATE SEQUENCE public."Reports_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Reports_id_seq" OWNER TO birmanila;

--
-- Name: Reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: birmanila
--

ALTER SEQUENCE public."Reports_id_seq" OWNED BY public."Reports".id;


--
-- Name: SubmittedReports; Type: TABLE; Schema: public; Owner: birmanila
--

CREATE TABLE public."SubmittedReports" (
    id bigint NOT NULL,
    "reportId" bigint NOT NULL,
    "officeId" bigint NOT NULL,
    "dateCreated" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "localDue" timestamp(3) without time zone NOT NULL,
    "nationalDue" timestamp(3) without time zone NOT NULL,
    files text,
    status public."Status" NOT NULL,
    message text
);


ALTER TABLE public."SubmittedReports" OWNER TO birmanila;

--
-- Name: SubmittedReports_id_seq; Type: SEQUENCE; Schema: public; Owner: birmanila
--

CREATE SEQUENCE public."SubmittedReports_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."SubmittedReports_id_seq" OWNER TO birmanila;

--
-- Name: SubmittedReports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: birmanila
--

ALTER SEQUENCE public."SubmittedReports_id_seq" OWNED BY public."SubmittedReports".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: birmanila
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO birmanila;

--
-- Name: Comments id; Type: DEFAULT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Comments" ALTER COLUMN id SET DEFAULT nextval('public."Comments_id_seq"'::regclass);


--
-- Name: DocumentPurpose id; Type: DEFAULT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."DocumentPurpose" ALTER COLUMN id SET DEFAULT nextval('public."DocumentPurpose_id_seq"'::regclass);


--
-- Name: DocumentStatus id; Type: DEFAULT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."DocumentStatus" ALTER COLUMN id SET DEFAULT nextval('public."DocumentStatus_id_seq"'::regclass);


--
-- Name: DocumentTypes id; Type: DEFAULT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."DocumentTypes" ALTER COLUMN id SET DEFAULT nextval('public."DocumentTypes_id_seq"'::regclass);


--
-- Name: Events id; Type: DEFAULT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Events" ALTER COLUMN id SET DEFAULT nextval('public."Events_id_seq"'::regclass);


--
-- Name: Offices id; Type: DEFAULT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Offices" ALTER COLUMN id SET DEFAULT nextval('public."Offices_id_seq"'::regclass);


--
-- Name: Positions id; Type: DEFAULT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Positions" ALTER COLUMN id SET DEFAULT nextval('public."Positions_id_seq"'::regclass);


--
-- Name: Reports id; Type: DEFAULT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Reports" ALTER COLUMN id SET DEFAULT nextval('public."Reports_id_seq"'::regclass);


--
-- Name: SubmittedReports id; Type: DEFAULT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."SubmittedReports" ALTER COLUMN id SET DEFAULT nextval('public."SubmittedReports_id_seq"'::regclass);


--
-- Data for Name: Assigned; Type: TABLE DATA; Schema: public; Owner: birmanila
--

COPY public."Assigned" ("officerId", "documentId", assignment) FROM stdin;
2bc621ca-adde-4f16-8981-a06db4163d51	RR6-2024-5-00001	APPROVER
2bc621ca-adde-4f16-8981-a06db4163d51	RR6-2024-5-00007	APPROVER
2bc621ca-adde-4f16-8981-a06db4163d51	RR6-2024-5-00043	APPROVER
\.


--
-- Data for Name: Comments; Type: TABLE DATA; Schema: public; Owner: birmanila
--

COPY public."Comments" (id, "documentId", recipient, sender, message, "dateCreated") FROM stdin;
\.


--
-- Data for Name: DocumentPurpose; Type: TABLE DATA; Schema: public; Owner: birmanila
--

COPY public."DocumentPurpose" (id, label) FROM stdin;
1	Investigation
2	Initial
3	Signature
4	Necessary Action
5	Study and Report
6	Approval
7	As Required
8	See Me
9	Verification
10	File
11	Transmittal with Docket
12	Letter with Docket
13	Docket
14	1st Indorsement with Docket
15	2nd Indorsement with Docket
16	Comment
17	For Your Informmtion
18	Memo with Docket
\.


--
-- Data for Name: DocumentStatus; Type: TABLE DATA; Schema: public; Owner: birmanila
--

COPY public."DocumentStatus" (id, label, category) FROM stdin;
10	Not Actionable	NOT_ACTIONABLE
11	Closed	FINISHED
12	Referred	REFERRED
13	Submitted	SUBMITTED
\.


--
-- Data for Name: DocumentTypes; Type: TABLE DATA; Schema: public; Owner: birmanila
--

COPY public."DocumentTypes" (id, label) FROM stdin;
1	Letter
2	Letter with Attachment
3	Letter Received via Registered Mail
4	Email with Attachment
5	Copy of Email Received
6	Copy of Email Received with Attachment
7	Compliance with Attachment
8	Show Cause Order
9	Revenue Special Order
10	Transmittal
11	Warrant of Distraint
12	LPN with Attachment
13	Affidavit
14	Advance Copy Sent via Email
15	Operational Memo
16	Memo
17	Memo with Attachment
18	Memo Received via Email
19	Indorsement
20	Reference Slip w/ Attachment
21	Memo Received via Registered Mail
22	List of Report
\.


--
-- Data for Name: Documents; Type: TABLE DATA; Schema: public; Owner: birmanila
--

COPY public."Documents" ("referenceNum", subject, description, "receivedFrom", "typeId", "purposeId", "dateCreated", "dateDue", tag, "signatureId") FROM stdin;
RR6-2024-4-00003	Risus pretium quam vulputate dignissim suspendisse in est ante. Diam ut venenatis tellus in metus. Amet porttitor eget dolor morbi non arcu risus.	Et tortor at risus viverra. Mauris in aliquam sem fringilla ut. Ac turpis egestas sed tempus urna et pharetra pharetra. Malesuada pellentesque elit eget gravida cum sociis natoque. Massa eget egestas purus viverra. Netus et malesuada fames ac.	National Office	16	17	2024-04-08 16:41:41.844	2024-04-08 16:40:42.706	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-4-00001	Pharetra et ultrices neque ornare aenean euismod elementum nisi quis. Sed elementum tempus egestas sed sed risus pretium.	Posuere morbi leo urna molestie at elementum eu facilisis sed. Egestas tellus rutrum tellus pellentesque eu tincidunt tortor aliquam. Amet massa vitae tortor condimentum lacinia quis vel.	National Office	4	12	2024-04-08 16:39:08.52	2024-04-11 16:38:08	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-4-00002	Massa sapien faucibus et molestie ac feugiat sed lectus vestibulum. Facilisis volutpat est velit egestas dui id ornare arcu.	Netus et malesuada fames ac. Nisi porta lorem mollis aliquam ut porttitor. A diam maecenas sed enim ut sem. Massa tincidunt nunc pulvinar sapien. Id cursus metus aliquam eleifend mi in. Curabitur gravida arcu ac tortor dignissim convallis aenean.	National Office	9	4	2024-04-08 16:40:10.975	2024-04-11 16:39:13	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-4-00004	Test.04.16.24	Test only	National Office	18	7	2024-04-16 03:09:27.582	2024-04-16 03:02:50.315	CONFIDENTIAL	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00010	LETTER OF COMPROMISE	LETTER DTD APR 30, 2024 FR GREAT FAITH TRUCKING & GEN. MERCH. INC. RE LETTER OF COMPROMISE	JACLYN MAGDALENE C. TIO	1	4	2024-05-22 02:47:56.605	2024-05-22 02:47:43.032	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00002	LETTER DTD APR 16, 2024 FR AVENIDA & DIAZ LAW OFFICE RE SUBPOENA DTD 14 MAR 2024 SDT NO. RR6-2024-243 FOR CLIENT MICHEALLE R. YU LEE RE REQUEST FOR ANOTHER DATE ON AVAILABILITY TO DISCUSS 2022 BOOKS OF ACCOUNTS AND ACCOUNTIGN RECORDS	For immediate appropriate action.	ROBENSON D. AVENIDA	1	4	2024-05-22 02:08:43.634	2024-05-22 01:58:46.763	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00003	MEMO RCVD VIA REGD MAIL DTD APR 5, 2024 FR BIR NOB, HREA COLL SRVC RE SUBMISSION OF RECONCILIATION REPORT OF COLLECTIONS BY CHANNEL OF PAYMENT FOR THE PERIOD OF JANUARY TO FEBRUARY 2024 	For immediate appropriate action.	SALINA B. MARINDUQUE	16	4	2024-05-22 02:13:38.427	2024-05-22 02:12:42	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00004	LETTER DTD APR 12, 2024 FR AURORA (OA) PHILS., INC. RE REPLY LETTER TO VAT ELA AND CHECKLIST OF REQUIREMENTS FOR TY 2023	For immediate appropriate action.	S.L. ONG	1	4	2024-05-22 02:23:21.647	2024-05-22 02:21:55.938	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00005	LETTER DTD APR 19, 2024 FR KAN SY HAU RE REQUEST TO LIFT THE WARRANT OF GARNISHMENT	For immediate appropriate action.	KAN SY HAU	1	4	2024-05-22 02:29:40.282	2024-05-22 02:24:50.29	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00006	LETTER W/ATTACHMENT DTD APR 2, 2024 FR PNR RE EXECUTIVE SUMMARY FOR THE ASSESSED TAX DEFICIENCIES BY THE PNR FOR TY 2018	For immediate appropriate action.	ATTY CELESTE D. LAUTA	2	4	2024-05-22 02:31:56.846	2024-05-22 02:31:05.211	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00007	LETTER DTD APR 29, 2024 FR BIR NOB, ATTY. ALYASAH M. ANDIG, OIC-CHIEF NID RE REQUEST FOR CERTIFIED COPIES OF DOCUMENTS FILED BY SORIANOTEK CORP DOING BUSINESS UNDER THE NAME AND STYLE OF GPM EMISSION (TIN: 450-921-685-000) AND REYES CATHERINE BARCELONA (TIN: 184-987-086-000)	For immediate appropriate action.	ATTY ALYASAH M. ANDIG	16	4	2024-05-22 02:37:14.965	2024-05-22 02:33:20.733	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00008	EMAIL W/ATTACHMENT DTD MAY 6, 2024 FR PAUL CEDRICK DAVID, CPMD BIR NOB RE REQUEST FOR THE SUBMISSION OF REPORT ON UNPAID AMOUNT OF 1,000 PESOS WITH TAX DUE FILED IN 2018-2022 THRU EFPS AND EBIR. ATTACHMENT WILL BE SENT THRU EMAIL. 	For immediate appropriate action.	PAUL CEDRICK DAVID	4	4	2024-05-22 02:42:52.568	2024-05-22 02:40:36.315	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00009	LETTER DTD APR 20, 2024 FR BATAAN MANUFACTURING CO INC RE APPLYING FOR COMPROMISE SETTLEMENT IN REF TO LOA FOR TY 2019	For immediate appropriate action.	MARINELA S. VELASQUEZ	1	4	2024-05-22 02:46:20.836	2024-05-22 02:45:26.788	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00011	MEMO W/ATTACHMENT DTD APR 25, 2024 FR BIR NOB ACIR CSS RE INACTIVE TAXPAYERS AND DTI'S LIST OF ENGAGED IN ONLINE SELLING AS OF MARCH 2024 FOR VALIDATION WERE SENT TO THE GENERIC EMAIL ADDRESSES OF RDO AND CSS. DEADLINE: MAY 31, 2024	For immediate appropriate action.	JANETTE R. CRUZ	16	4	2024-05-22 02:50:17.734	2024-05-31 02:49:21	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00012	LETTER DTD MAY 2, 2024 FR ALPHA TOTAL SOLUTIONS, INC. (ATSI) RE REQUEST FOR REINVESTIGATION IN REF TO FAN FOR TY 2021	For immediate appropriate action.	GLENDA A. SANCHEZ	1	4	2024-05-22 02:51:30.937	2024-05-22 02:52:03.273	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00013	MEMO RCVD VIA EMAIL DTD MAY 3, 2024 FR BIR NOB DEPCOM OG RE REITERATION OF PROPER PROCEDURES IN THE PREPARATION OF REPORTS ON DRASTIC CHANGES IN COLLECTION PERFORMANCE 	For immediate appropriate action.	MARIDUR V. ROSARIO	18	4	2024-05-22 02:53:16.009	2024-05-22 02:52:54.264	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00014	LETTER W/ATTACHMENT DTD MAY 3, 2024 FR JSG PREMIER HOME, INC. RE CLARIFICATION ON RR 12-2011 	For immediate appropriate action.	JORSEN HERRICK L. GO	1	4	2024-05-22 02:55:13.22	2024-05-22 02:54:38.087	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00015	LETTER DTD MAR 18, 2024 FR CARPIO & CARPIO LAW OFFICES FOR CLIENT CHINGMAN WONG ANG, HUYLIAN DEVELOPMENT INC. PROPERTY RE REQUEST FOR PARTIAL DISPOSITION OF ESTATE	For immediate appropriate action.	LUCAS C. CARPIO	1	4	2024-05-22 02:56:50.512	2024-05-22 02:56:35.545	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00016	LETTER DTD MAY 7, 2024 FR CARLA CAMILLE SAGUN GAY-YA RE APPLYING OF COMPROMISE SETTLEMENT FOR TY 2019 INVOLVING ASSMT NO. 34-19-99247-2022-357 (IT)	For immediate appropriate action.	CARLA CAMILLE SAGUN GAY-YA	1	4	2024-05-22 02:57:47.846	2024-05-22 02:58:12.88	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00017	LETTER DTD MAY 6, 2024 FR MBPS CABLING CORP. RE REQUEST FOR APPOINTMENT/MEETING WITH THE ASSIGNED GS/RO ON NOTICE OF DISCREPANCY (NOD) DTD MAY 2, 2024 FOR TY 2022	For immediate appropriate action.	ORLANDO A. DELA CRUZ	1	4	2024-05-22 02:59:37.603	2024-05-22 02:59:09.568	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00018	MEMO W/ATTACHMENT RCVD VIA REGD MAIL DTD APR 24, 2024 FR BIR NOB HREA COLL SRVC RE REQUEST TO SUBMIT A REPORT INDICATING THE UPDATE ON THE MEETING OF GOVT ENTITIES WITH DELINQUENT/OUTSTANDING TAX LIABILITIES	For immediate appropriate action.	SALINA B. MARINDUQUE	17	4	2024-05-22 03:01:27.593	2024-05-22 03:01:03.094	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00021	REQUEST FOR IMMEDIATE RELIEFS AND URGENT DELIVERY OF GOVERNMENT SERVICES	REF SLIP W/ATTACHMENTS DTD APR 25, 2024 FR BIR NOB, COS ODCOG RE LETTER W/ATTACHMENTS FR MBPS CABLING CORPORATION RE REQUEST FOR IMMEDIATE RELIEFS AND URGENT DELIVERY OF GOVERNMENT SERVICES	PHILIP A. MAYO	20	4	2024-05-22 03:05:21.587	2024-05-22 03:05:23.226	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00022	WARRANT OF GARNISHMENT ISSUED BY THE BIR AGAINST SUMMIT GUARANTY AND INSURANCE COMPANY INC. (SGIC)	REF SLIP W/ATTACHMENTS DTD APR 23, 2024 FR BIR NOB, COS ODCOG RE LETTER FR INSURANCE COMMISSION RE WARRANT OF GARNISHMENT ISSUED BY THE BIR AGAINST SUMMIT GUARANTY AND INSURANCE COMPANY INC. (SGIC)	PHILIP A. MAYO	20	4	2024-05-22 03:10:58.051	2024-05-22 03:06:44.407	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00035	LETTER OF MR. BAQUER MAGARANG LAUT REQUESTING FOR TRANSFER FOR EMPLOYMENT AND OTHER DOCUMENTS (201 FILE)	INDORSEMENT W/ ATTACHMENTS RCVD VIA REGD MAIL DTD APR 5, 2024 FR RR8B, REGIONAL DIRECTOR RE LETTER OF MR. BAQUER MAGARANG LAUT REQUESTING FOR TRANSFER FOR EMPLOYMENT AND OTHER DOCUMENTS (201 FILE)	EDGAR B. TOLENTINO	19	4	2024-05-22 03:33:02.83	2024-05-22 03:33:08.01	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00037	FOREIGN-SOURCE INCOME OF DOMESTIC TAXPAYERS UNDER THE JURISDICTION OF THE RR6 MANILA	MEMO W/ATTACHMENT RCVD VIA REGD MAIL DTD MAR 25, 2024 FR BIR NOB CHIEF, INTERNATIONAL TAX AFFAIRS DIV RE FOREIGN-SOURCE INCOME OF DOMESTIC TAXPAYERS UNDER THE JURISDICTION OF THE RR6 MANILA	ROBBIE M. BANAGA	17	4	2024-05-22 03:44:13.979	2024-05-22 03:44:20.849	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00020	REF SLIP W/ ATTACHMENTS DTD APR 25, 2024 FR BIR NOB, COS ODCOG RE LETTER W/ATTACHMENT FR PAGIBIG FUND HDMF RE REQUEST FOR LIFTING OF NOTICE OF LEVY ON PROPERTIES DUE TO GENT CORP CORPORATE TAX LIABILITY FOR TY 2010	For immediate appropriate action.	PHILIP A. MAYO	20	4	2024-05-22 03:04:00.474	2024-05-22 03:04:06.534	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00023	REF SLIP W/ATTACHMENT RCVD VIA EMAIL DTD APR 30, 2024 FR BIR NOB COS ODCOG RE LETTER FR SENATOR RAFFY TULFO RE OFFICIAL CORRESPONDENCES AND REQUESTS FROM THE OFFICE OF SENATOR RAFFY TULFO	For immediate appropriate action.	PHILIP A. MAYO	20	4	2024-05-22 03:12:14.042	2024-05-22 03:12:24.961	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00024	1ST INDORSEMENT W/ ATTACHMENTS DTD APR 24, 2024 FR BIR NOB, ACIR IAS RE LETTER DTD JAN 11, 2024 OF SOLOMON CHAM OF CHAM SAMCO AND SONS INC., ON THE REQUEST TO CANCEL AND/OR CONSIDER VOID AND UNENFORCEABLE THE ELA SN: ELA202200014016 DTD SEP 22, 2023. FURTHER RID REQUESTED TO CONDUCT AN INVESTIGATION AND TO SUBMIT TO THE ACIR INTERNAL AFFAIRS SERVICE	For immediate appropriate action.	DANIEL T. DE JESUS	19	4	2024-05-22 03:16:01.676	2024-05-22 03:15:21.559	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00025	LETTER W/ATTACHMENT DTD MAY 6, 2024 FR PHILIPPINE EASTERN CARGO EXPRESS SERVICES CORP. RE PROTEST ON FINAL ASSESSMENT NOTICE AND FORMAL LETTER OF DEMAND FOR TY 2020	For immediate appropriate action.	MA. ARIET J. RAMIREZ	2	4	2024-05-22 03:17:35.001	2024-05-22 03:17:23.931	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00026	LETTER W/ATTACHMENT DTD MAY 8, 2024 FR INTERNSHIP NAVIGATION TRAINING CENTER RE SUBMISSION OF AFS WITH PREVIOUSLY FILED ITR	For immediate appropriate action.	JEFF REC C. CALAMBUHAY	2	4	2024-05-22 03:19:00.837	2024-05-22 03:18:57.127	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00027	LETTER W/ATTACHMENT DTD MAY 9, 2024 FR TDG LOGISTICS AND SHIPPING CORPORATION RE CONVERSION AND USE THE REMAINING O.R. AS INVOICE UNTIL FULLY CONSUMED	For immediate appropriate action.	MARNIE MAY L. NACION	2	4	2024-05-22 03:19:55.248	2024-05-22 03:20:27.831	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00028	LETTER W/ATTACHMENT DTD MAY 12, 2024 FR PACIFIC MULTI-HOMES, INC. RE PROTEST TO FLD/FAN WITH REQUEST FOR REINVESTIGATION FOR TY 2020	For immediate appropriate action.	ARIEL PINOTE	2	4	2024-05-22 03:21:03.07	2024-05-22 03:21:17.54	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00029	LETTER DTD MAY 9, 2024 FR OFFICE OF THE CHANCELLOR UP MANILA RE REQUEST FOR WAIVER OF PENALTY ON DELAYED FILING OF ANNUAL INCOME TAX	For immediate appropriate action.	DR. MICHAEL L. TEE	2	4	2024-05-22 03:22:29.941	2024-05-22 03:22:55.279	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00030	MEMO W/ATTACHMENT RCVD VIA REGD MAIL DTD APR 22, 2024 FR BIR NOB DEP COM OG RE ACQUIRED REAL PROPERTIES FROM KAMERAWORLD, INC.	For immediate appropriate action.	MARIDUR V. ROSARIO	21	4	2024-05-22 03:23:34.166	2024-05-22 03:23:51.873	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00031	LETTER W/ATTACHMENT DTD MAY 9, 2024 FR ICTSI LTD. REGIONAL OPERATING HEADQUARTERS RE RESPONSE TO THE NOTICE OF DISCREPANCY DTD MAY 5, 2024 FOR TY 2022	For immediate appropriate action.	CHRISTINE MELODY L. REBUDIAO	2	4	2024-05-22 03:27:04.897	2024-05-22 03:25:27.741	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00032	LETTER W/ATTACHMENT RCVD VIA REGD MAIL DTD MAY 10, 2024 FR HREA INTERNAL AFFAIRS SERVICE, CHIEF PERSONNEL ADJUDICATION DIV RE NOTICE OF DECISION FOR MR. SALVADOR D. ESQUIVIAS RE INSUBORDINATION AND VIOLATION OF REASONABLE OFFICE RULES AND REGULATIONS BIR-PAD ADMINISTRATIVE CASE NO. 3246-14	For immediate appropriate action.	MARIA FLORINDA Z. BACENA	2	4	2024-05-22 03:29:03.11	2024-05-22 03:28:39.667	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00033	LETTER DTD MAY 11, 2024 FR STUDENT RESEARCHERS OF PAMANTASAN NG LUNGSOD NG MAYNILA RE REQUESTING DATA FOR RESEARCH REGARDING THE ACTUAL NUMBER FOR 2023 OF SMALL-SIZED ENTERPRISES LOCATED AT DISTRICT 3, MANILA	For immediate appropriate action. 	SHEILA MARY A. AHING	1	4	2024-05-22 03:30:39.392	2024-05-22 03:30:25.719	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00034	INDORSEMENT W/ ATTACHMENTS RCVD VIA REGD MAIL DTD MAR 8, 2024 FR RR8B, REGIONAL DIRECTOR RE DOCKET RE COMPLAINT FILED BY MICHAEL G. SANTOS AGAINST ORIENTAL PHOTOGRAPHIX & EQUIPMENT COMPANY (TIN: 000-333-358-000)	For immediate appropriate action. 	EDGAR B. TOLENTINO	19	4	2024-05-22 03:31:46.312	2024-05-22 03:32:01.803	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00036	INDORSEMENT W/ ATTACHMENTS RCVD VIA REGD MAIL DTD APR 11, 2024 FR RR8B, REGIONAL DIRECTOR RE DOCUMENTS FOR TRANSFER (201 FILE) OF MR. MOHAMMAD PIANG MACUGAR 	For immediate appropriate action. 	NOLAN D. OFRECIO	19	4	2024-05-22 03:34:33.678	2024-05-22 03:34:25.963	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00048	LETTER W/ATTACHMENT DTD MAY 17, 2024 FR HONOUR LANE LOGISTICS PHILIPPINES, INC. RE REQUEST FOR EXTENSION OF TIME TO SUBMIT AND REQUEST  FOR ANOTHER DISCUSSION OF DISCREPANCY WITH EVIDENCE TRANSFER RECEIPT (TRANSMITTAL) FOR NOD TY 2021	For immediate appropriate action.	LIGERT BRYAN LEE	2	4	2024-05-23 01:53:22.241	2024-05-23 01:53:39.086	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00049	LETTER DTD MAY 8, 2024 FR CATHERINE LOH RE REQUESTING FOR STAGGERED PAYMENT OF ATLEAST 3 MONTHS IN REF TO LOA TY 2009	For immediate appropriate action.	CATHERINE LOH	1	4	2024-05-23 01:54:19.724	2024-05-23 01:54:44.887	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00038	LETTER W/ATTACHMENT DTD MAY 15, 2024 FR COSCO SHIPPING LINES (PHILIPPINES) INC. RE REQUESTING TO USE THE REMAINING SERIES OF THE O.R UP TO DECEMBER 31, 2024 FOR COSCO SHIPPING LINES (PHIL.) INC. (TIN: 200-060-030-000) AND FOR AN EXTENSION TO UPDATE SYSTEM CONFIGURATION FROM O.R TO SALES INVOICE (VAT TO NON-VAT) FOR NEW GOLDEN SEA SHIPPING PTE LTD. (TIN: 492-618-709-000) & COSCO SHIPPING LINES CO., LTD (TIN: 297-529-696-000)	For immediate appropriate action.	JOHANNA GUINTO	2	4	2024-05-22 03:45:33.53	2024-05-22 03:45:42.893	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00039	MEMO W/ATTACHMENT RCVD VIA EMAIL DTD MAY 13, 2024 FR BIR NOB DEPCOM OG RE REPORT EMAILED BY MS. NELLY FONTANILLA RE NON-ISSUANCE OF RECEIPT/INVOICE OF MERCHANT ADL ONLINE CORPORATION (TIN: 631-499-976) REGISTERED WITH SHOPEE PHILIPPINES' ONLINE PLATFORM. KINDLY VALIDATE AND TAKE APPROPRIATE ACTION. SUBMIT REPORT TO THE TSPMD VIA EMAIL AT tpsmd_tas@bir.gov.ph ON OR BEFORE MAY 20, 2024	For immediate appropriate action.	MARIDUR V. ROSARIO	17	4	2024-05-22 05:02:10.416	2024-05-20 05:01:54	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00001	MEMO RCV VIA MAIL DTD APRIL 29, 2024 FR BIR NOB, DEPCOM RMG MARIDUR V. ROSARIO RE SUBMISSION OF ROADMAP AND CALENDAR OF ACTIVITIES ON ISO 9001:2015 QMS CERTIFICATION PLEASE SUBMIT ON OR BEFORE MAY 3, 2024.	For immediate appropriate action. 	MARIDUR V. ROSARIO	18	7	2024-05-20 02:14:42.815	2024-05-06 02:05:13	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00019	REF SLIP W/ ATTACHMENTS DTD APR 23, 2024 FR BIR NOB, COS ODCOG RE EMAIL FR DANICA CONCEPCION RE COMPLAINT ON NON ISSUANCE OF RECEIPT AGAINST SHOPEE-SHOP: JHVN INS' COLLECTION 	For immediate appropriate action.	PHILIP A. MAYO	20	4	2024-05-22 03:02:44.956	2024-05-22 03:02:56.17	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00040	MEMO RCVD VIA EMAIL DTD MAY 16, 2024 FR DEPCOM OG RE MONITORING OF BUSINESS ACTIVITIES OF TAXPAYERS ENGAGED IN ART GALLERIES/AUCTION SALE/PROMOTION OF CONCERTS AND OTHER SIMILAR ACTIVITIES. KINDLY SUBMIT UPDATE ON THE ACTIONS TAKEN BY YOUR OFFICE IN THIS INITIATIVE TO THE DEPCOMM OG THRU THA ACIR OF ASSESSMENT SRVC ATTENTION: THE CHIEF, ASSMT PROGRAMS DIVISION ON OR BEFORE MAY 21, 2024	For immediate appropriate action.	MARIDUR V. ROSARIO	18	4	2024-05-23 01:31:35.823	2024-05-23 01:31:46.657	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00041	REF SLIP W/ATTACHMENT RCVD VIA REGD MAIL DTD APR 29, 2024 FR BIR NOB COS ODCOG RE INDORSEMENT FROM DOF : REQUEST FOR CERTIFIED TRUE COPY OF THE REQUEST FOR SDT FROM BIR RDO 32 AND BIR LEGAL DIV OF RR6 - LETTER FROM MR. ORLANDO A. DELA CRUZ OF MBPS CABLING CORP. 	For immediate appropriate action.	PHILIP A. MAYO	20	4	2024-05-23 01:36:03.227	2024-05-23 01:36:07.657	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00042	MEMO W/ATTACHMENT RCVD VIA REGD MAIL DTD MAY 6, 2024 FR BIR NOB DEPCOM OG RE RESPONSE TO THE CONFISCATED VAPE PRODUCTS TEMPORARILY STORED AT RR6 MANILA	For immediate appropriate action.	MARIDUR V. ROSARIO	21	4	2024-05-23 01:38:44.413	2024-05-23 01:37:27.075	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00043	MEMO W/ATTACHMENT RCVD VIA REGD MAIL DTD MAY 20, 2024 RE REQUEST FOR COPY OF INCOME TAX RETURNS (ITR) AND BIR CERTIFICATION OF TAXPAYER RONALD SAN JOSE ENCARNACION (TIN: 116-261-899-000)	For immediate appropriate action.	TERESITA M. ANGELES	21	4	2024-05-23 01:39:49.134	2024-05-23 01:40:08.441	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00044	MEMO W/ATTACHMENT RCVD VIA REGD MAIL DTD MAY 10, 2024 RE REQUEST FOR THE REFUND OF ELECTRONIC DOCUMENTARY STAMP TAX (eDST) UTILIZATION OF PACIFIC CROSS INSURANCE, INC. 	For immediate appropriate action.	MARIDUR V. ROSARIO	21	4	2024-05-23 01:41:34.896	2024-05-23 01:41:44.343	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00045	1ST INDORSEMENT W/ ATTACHMENTS DTD APR 30, 2024 FR BIR NOB, ACIR IAS RE UNDATED LETTER OF COMPLAINT OF BENIGNO REYES OF FRANCISCO HOMES, SAN JOSE DEL MONTE CITY, BULACAN AGAINST CHIEF OLIVIA JOSUE, AHRMD FOR ALLEGED UNAUTHORIZED REIMBURSEMENT OF EXPENSES FOR GASOLINE USED BY SOME UNNAMED EMPLOYEES/OFFICIALS IN THEIR PERSONAL TRAVELS, FRAUDULENT TRANSACTIONS IN THE PURCHASE OF GOODS FOR OFFICIAL USE. 	For immediate appropriate action.	DANIEL T. DE JESUS	19	4	2024-05-23 01:42:49.26	2024-05-23 01:42:58.004	CONFIDENTIAL	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00046	LISTS OF COMMERCIAL/WAREHOUSES FR REGIONAL DIRECTOR DTD MAY 21, 2024 RE SUBMIT YOUR STATUS REPORT ON INVESTIGATION	For immediate appropriate action.	RENATO N. MOLINA	22	1	2024-05-23 01:50:34.157	2024-05-23 01:49:11.267	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00047	LETTER DTD MAY 16, 2024 FR METRO JEWEL CORP. RE OFFERING ONE MILLION PESOS FOR THE SUBJECT ASSESSMENT FOR TY 2022 TO 2023	For immediate appropriate action.	GLORDELYN MANCIO	1	4	2024-05-23 01:52:16.038	2024-05-23 01:52:00.286	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00050	LETTER DTD MAY 8, 2024 FR CATHERINE LOH RE REQUESTING FOR STAGGERED PAYMENT OF ATLEAST 3 MONTHS IN REF TO LOA TY 2010	For immediate appropriate action.	CATHERINE LOH	1	4	2024-05-23 01:55:17.844	2024-05-23 01:55:43.164	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00051	LETTER W/ATTACHMENT DTD MAY 7, 2024 FR TRANSNATIONAL LOGISTICS INC. RE EXTENSION OF USE AND CONVERTING OFFICIAL RECEIPTS TO SALES INVOICE IN ACCORDANCE TO REVENUE REGULATION  7-2024	For immediate appropriate action.	MARY JANE R. MOLINA	2	4	2024-05-23 01:56:19.021	2024-05-23 01:56:40.926	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00052	LETTER W/ATTACHMENT DTD MAY 20, 2024 FR PACIFIC REGENCY RE REQUESTING TO EXTEND THE DEADLINE OF COMPUTERIZED ACCOUNTING PERMIT (CAS) UNTIL OCT. 31, 2024 WIITHIN 6 MONTHS FROM THE REGULATION'S EFFECTIVE DATE.	For immediate appropriate action.	KRYSTEM C. UEZU	2	4	2024-05-23 01:57:27.308	2024-05-23 01:57:48.441	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00053	LETTER W/ATTACHMENT DTD MAY 18, 2024 FR LEO SOSA ROMAGUERA RE LETTER TO APPEAL ON NOTICE OF LEVY ON REAL PROPERTY, ACCT 003-202000285, TD C1-076040927 	For immediate appropriate action.	LEO SOSA ROMAGUERA	2	4	2024-05-23 01:58:18.239	2024-05-23 01:58:49.343	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00054	LETTER W/ATTACHMENT DTD MAY 21, 2024 FR SUPER TITAN DISTRIBUTION CORP. RE REQUEST FOR REINVESTIGATION AND REASSESSMENT ON FAN FOR 1ST SEMESTER 2021 	For immediate appropriate action.	MARTIN YU	2	4	2024-05-23 01:59:07.759	2024-05-23 01:59:41.08	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00055	MEMO W/ATTACHMENT RCVD VIA EMAIL DTD MAY 3, 2024 FR  BIR NOB OIC - ACIR, ASSESSMENT SERVICE RE UPDATES ON ELA CASES IN ELAMS AND IRIS-CMS. YOUR ARE HEREBY DIRECTED TO RECONCILE THE AFOREMENTIONED DATA AGAINST YOUR ACTUAL DATA/RECORDS AND UPDATE THE CASES DIRECTLY IN ELAMS AND IRIS-CMS. 	For immediate appropriate action.	ROSANA P. SAN VICENTE	18	4	2024-05-23 02:06:14.344	2024-05-23 02:05:31.388	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00056	MEMO W/ATTACHMENT RCVD VIA EMAIL DTD MAY 21, 2024 FR BIR NOB DEPCOM OG RE CONDUCT OF INVESTIGATION ON THE ALLEGED ONLINE SELLERS OF TINS/TIN CARDS THRU ORUS. ALL CSS CHIEFS ARE INSTRUCTED TO SUSPEND THE ORUS ACCOUNTS OF THE ALLEGED ONLINE SELLERS PENDING RESULT OF INVESTIGATION.	For immediate appropriate action.	MARIDUR V. ROSARIO	18	4	2024-05-23 02:10:06.342	2024-05-23 02:07:48.207	TOP_PRIORITY	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00057	MEMO W/ATTACHMENT RCVD VIA EMAIL DTD MAY 10, 2024 FR BIR NOB DEPCOM OG RE PRINTING AND DISPLAY OF FEEDBACK AND COMPLAINTS MECHANISM IN YOUR OFFICE'S TAXPAYER ASSISTANCE LOUNGE AND IN FRONT OF YOUR ACTION OFFICERS 	For immediate appropriate action.	MARIDUR V. ROSARIO	18	4	2024-05-23 02:23:49.739	2024-05-23 02:11:29.61	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00058	LETTER W/ATTACHMENT RCVD VIA REGD MAIL DTD MAY 6, 2024 FR BIR NOB, DEPCOM OG RE REQUEST FOR CONSIDERATION REGARDING THE ACQUIRED REAL PROPERTY COVERED BY TCT NO. 002-2022003771	For immediate appropriate action.	MARIDUR V. ROSARIO	3	4	2024-05-23 02:30:49.97	2024-05-23 02:25:29.365	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
RR6-2024-5-00059	LETTER W/ATTACHMENT RCVD VIA REGD MAIL DTD MAY 6, 2024 FR BIR NOB, DEPCOM OG RE OFFER TO BUY THE ACQUIRED PROPERTY COVERED BY TCT NO. 002-2021001828	For immediate appropriate action.	MARIDUR V. ROSARIO	3	4	2024-05-23 02:33:54.022	2024-05-23 02:32:12.637	\N	bbcb88fe-f238-4b1e-9b93-70c90b55f708
\.


--
-- Data for Name: Events; Type: TABLE DATA; Schema: public; Owner: birmanila
--

COPY public."Events" (id, subject, description, date, frequency, image) FROM stdin;
2	Holiday	EDSA Revolution	2024-02-25 11:59:36	YEARLY	\N
3	Sample Birthday	Sample Birthday Celebrant	2024-03-12 16:00:00	YEARLY	https://rr6manila.com/api/media/1709042730098_bday.jpg
4	Sample Birthday	Sample Birthday Celebrant	2024-02-19 16:00:00	YEARLY	https://rr6manila.com/api/media/1709131219504_bday.jpg
\.


--
-- Data for Name: Officers; Type: TABLE DATA; Schema: public; Owner: birmanila
--

COPY public."Officers" (uuid, "firstName", "lastName", "positionId", "officeId", password, signature, active, device, avatar, code, email, phone, verified) FROM stdin;
cb729d25-8edd-4cbc-9dae-d855cc7359b7	Saripoden	Bantog	2	2	$2b$12$RNy/dcRgzXzEry6tZ2d9qennQ.TEy1XAhnji/vrdP4uokFT7neouu	\N	t	\N	/assets/images/avatars/avatar_30.jpg	167919	saripoden.bantog@bir.gov.ph	\N	f
bbcb88fe-f238-4b1e-9b93-70c90b55f708	Renato	Molina	1	1	$2b$12$fAcfmihrazGSukS9LPXYj.IODHcDCPAwk97fiCZQiUaNFwlG8QMma	https://rr6manila.com/api/media/1709088692144_Molina_signature.png	t	{"endpoint":"https://fcm.googleapis.com/fcm/send/dKOCLwUQwJU:APA91bFRnTkwSZ5ZvYPLbTJmExzi5mrjj3u_Nr1wHTR6W8FxquHHXopTbYvd22danrnX4HqH6_vLAWpsNQDeWcGiBjGRWRwLVs9p-vCI9JVoMI0AAP6cbru4uQMXh8lBL8fgCW6mMMLu","expirationTime":null,"keys":{"p256dh":"BB8lcFi86i5K0gLAftTsBkERdi8bj6Ite1gofgkYBul0jsoIY2WWwId2vCBgT_C7xz6TPweIJeFp-s3mGgX_BAY","auth":"kpW1OeRWtAtxsI0hireEFw"}}	/assets/images/avatars/avatar_27.jpg	\N	bir.rr6manila@gmail.com	9000000000	t
2bc621ca-adde-4f16-8981-a06db4163d51	CHARLIE	ESTO	3	9	$2b$12$VfAlIc2KEXCBgywJ3VWVFe9ULsUHLFycY274BFT48/.pNWys2Cg.2	https://rr6manila.com/api/media/1713322104949_Esto_signature.png	t	{"endpoint":"https://fcm.googleapis.com/fcm/send/eCetZU5NaxQ:APA91bFPLACI6qTerXCqmE7Rbrr3yo6JxzWM1XwLOhzVX2DI-ttDPpmLerZkck9CV6sfaxYwOu_52QvP2UO8-kMemH2ebBprLweoNDSJcBWScnVNJl5TZVCkdAvM5eHYrCe63heyp1_1","expirationTime":null,"keys":{"p256dh":"BJZy7QleU6kvTSaisq16915xAtI9Eig40xV94LRQxvyjQRN1uDIA3_bxt9JumIxrEAONhsSowxJnfmC_0l-aUeg","auth":"uNtNS_0DRfGxHM9xgR0pEw"}}	/assets/images/avatars/avatar_28.jpg	516421	charlie.esto@bir.gov.ph	9178968882	t
\.


--
-- Data for Name: Offices; Type: TABLE DATA; Schema: public; Owner: birmanila
--

COPY public."Offices" (id, name) FROM stdin;
1	Office of the Regional Director
2	Office of the Assistant Regional Director
3	Legal Division
4	Assessment Division
5	Regional Investigation Division
6	Collection Division
7	Finance Division
8	Administrative Human Resources Division
9	Document Processing Division
10	Revenue District Office 29
11	Revenue District Office 30
12	Revenue District Office 31
13	Revenue District Office 32
14	Revenue District Office 33
15	Revenue District Office 34
16	Revenue District Office 36
18	Client Support Unit
19	VATAS
\.


--
-- Data for Name: Positions; Type: TABLE DATA; Schema: public; Owner: birmanila
--

COPY public."Positions" (id, label, role) FROM stdin;
1	Regional Director	DIRECTOR
2	Asst. Regional Director	DIRECTOR
3	Division Chief	CHIEF
4	Asst. Division Chief	CHIEF
5	Revenue District Officer	CHIEF
6	Asst. Revenue District Officer	CHIEF
7	HR Admin	HR_ADMIN
8	Technical Support	SUPERUSER
9	Administrative Officer	OFFICER
11	Planning Officer	OFFICER
13	Client Support Unit Head	OFFICER
\.


--
-- Data for Name: Referrals; Type: TABLE DATA; Schema: public; Owner: birmanila
--

COPY public."Referrals" ("documentId", "officeId", "statusId") FROM stdin;
RR6-2024-4-00001	6	12
RR6-2024-4-00001	3	12
RR6-2024-4-00001	5	12
RR6-2024-4-00002	14	12
RR6-2024-4-00002	15	12
RR6-2024-4-00002	13	12
RR6-2024-4-00002	11	12
RR6-2024-4-00003	11	10
RR6-2024-4-00003	12	10
RR6-2024-4-00003	13	10
RR6-2024-4-00003	14	10
RR6-2024-5-00042	5	10
RR6-2024-4-00001	9	11
RR6-2024-5-00042	10	10
RR6-2024-4-00004	9	11
RR6-2024-4-00002	12	11
RR6-2024-5-00001	4	11
RR6-2024-5-00001	6	11
RR6-2024-5-00001	2	11
RR6-2024-5-00001	9	11
RR6-2024-5-00002	3	12
RR6-2024-5-00003	6	12
RR6-2024-5-00004	4	10
RR6-2024-5-00005	6	12
RR6-2024-5-00006	4	12
RR6-2024-5-00006	6	12
RR6-2024-5-00006	3	12
RR6-2024-5-00006	10	12
RR6-2024-5-00007	9	12
RR6-2024-5-00008	6	12
RR6-2024-5-00008	11	12
RR6-2024-5-00008	10	12
RR6-2024-5-00008	12	12
RR6-2024-5-00008	13	12
RR6-2024-5-00008	14	12
RR6-2024-5-00008	15	12
RR6-2024-5-00008	16	12
RR6-2024-5-00009	6	12
RR6-2024-5-00010	6	12
RR6-2024-5-00011	10	12
RR6-2024-5-00011	11	12
RR6-2024-5-00011	12	12
RR6-2024-5-00011	13	12
RR6-2024-5-00011	14	12
RR6-2024-5-00011	15	12
RR6-2024-5-00011	16	12
RR6-2024-5-00012	4	12
RR6-2024-5-00013	10	12
RR6-2024-5-00013	11	12
RR6-2024-5-00013	12	12
RR6-2024-5-00013	13	12
RR6-2024-5-00013	14	12
RR6-2024-5-00013	15	12
RR6-2024-5-00013	16	12
RR6-2024-5-00014	3	12
RR6-2024-5-00015	4	12
RR6-2024-5-00016	6	12
RR6-2024-5-00017	13	12
RR6-2024-5-00018	6	12
RR6-2024-5-00019	10	12
RR6-2024-5-00020	6	12
RR6-2024-5-00020	3	12
RR6-2024-5-00021	13	12
RR6-2024-5-00022	6	12
RR6-2024-5-00023	10	10
RR6-2024-5-00023	11	10
RR6-2024-5-00023	12	10
RR6-2024-5-00023	13	10
RR6-2024-5-00023	14	10
RR6-2024-5-00023	15	10
RR6-2024-5-00023	16	10
RR6-2024-5-00024	4	12
RR6-2024-5-00024	5	12
RR6-2024-5-00025	4	12
RR6-2024-5-00026	14	10
RR6-2024-5-00027	14	12
RR6-2024-5-00028	4	12
RR6-2024-5-00029	14	12
RR6-2024-5-00030	6	11
RR6-2024-5-00031	10	12
RR6-2024-5-00032	8	12
RR6-2024-5-00033	3	12
RR6-2024-5-00034	5	12
RR6-2024-5-00035	8	12
RR6-2024-5-00036	8	10
RR6-2024-5-00037	10	12
RR6-2024-5-00037	11	12
RR6-2024-5-00037	12	12
RR6-2024-5-00037	14	12
RR6-2024-5-00038	14	12
RR6-2024-5-00039	10	12
RR6-2024-5-00040	10	12
RR6-2024-5-00040	11	12
RR6-2024-5-00040	12	12
RR6-2024-5-00040	13	12
RR6-2024-5-00040	14	12
RR6-2024-5-00040	15	12
RR6-2024-5-00040	16	12
RR6-2024-5-00041	3	12
RR6-2024-5-00041	13	12
RR6-2024-5-00047	11	12
RR6-2024-5-00048	14	12
RR6-2024-5-00043	9	11
RR6-2024-5-00044	15	12
RR6-2024-5-00045	5	12
RR6-2024-5-00046	10	12
RR6-2024-5-00046	11	12
RR6-2024-5-00046	12	12
RR6-2024-5-00046	13	12
RR6-2024-5-00046	14	12
RR6-2024-5-00046	15	12
RR6-2024-5-00046	16	12
RR6-2024-5-00049	14	12
RR6-2024-5-00050	15	12
RR6-2024-5-00051	14	12
RR6-2024-5-00052	14	12
RR6-2024-5-00053	6	12
RR6-2024-5-00054	4	12
RR6-2024-5-00055	10	12
RR6-2024-5-00055	11	12
RR6-2024-5-00055	12	12
RR6-2024-5-00055	13	12
RR6-2024-5-00055	14	12
RR6-2024-5-00055	15	12
RR6-2024-5-00055	16	12
RR6-2024-5-00055	4	12
RR6-2024-5-00055	19	12
RR6-2024-5-00055	8	12
RR6-2024-5-00055	6	12
RR6-2024-5-00055	3	12
RR6-2024-5-00055	5	12
RR6-2024-5-00056	18	12
RR6-2024-5-00056	10	12
RR6-2024-5-00056	12	12
RR6-2024-5-00056	11	12
RR6-2024-5-00056	14	12
RR6-2024-5-00056	13	12
RR6-2024-5-00056	15	12
RR6-2024-5-00056	16	12
RR6-2024-5-00057	18	10
RR6-2024-5-00057	10	10
RR6-2024-5-00057	11	10
RR6-2024-5-00057	12	10
RR6-2024-5-00057	13	10
RR6-2024-5-00057	14	10
RR6-2024-5-00057	15	10
RR6-2024-5-00057	16	10
RR6-2024-5-00058	6	10
RR6-2024-5-00059	6	10
\.


--
-- Data for Name: Reports; Type: TABLE DATA; Schema: public; Owner: birmanila
--

COPY public."Reports" (id, name, basis, "localDue", "nationalDue", frequency, type) FROM stdin;
15	OPCR (Performance Plan)	RMO 12-2023 / Memorandum from the Asst. Commissioner of Planning and Management Service	2024-07-14 17:20:14	2024-07-14 17:20:14	YEARLY	HR
16	OPCR (Performance Evaluation)	RMO 12-2023 / Memorandum from the Asst. Commissioner of Planning and Management Service	2024-08-24 17:21:19	2024-08-24 17:21:19	YEARLY	HR
17	IPCR (Performance Plan)	RMO 12-2023 / Memorandum from DEPCOM of RMG	2024-07-14 17:22:13	2024-07-14 17:22:13	YEARLY	HR
19	Summary List of Individual Performance Ratings (Annex I)	RMO 12-2023 / Memorandum from DEPCOM of RMG	2024-08-30 17:23:39	2024-08-30 17:23:39	YEARLY	HR
18	IPCR (Performance Evaluation)	RMO 12-2023 / Memorandum from DEPCOM of RMG	2024-08-24 17:22:56	2024-08-24 17:22:56	YEARLY	HR
21	P P M P	Memorandum from the Office of the  Commisioner (September 11)	2024-12-30 17:57:56	2024-12-30 17:57:56	YEARLY	HR
23	Tardiness / Absences	Memorandum of the Regional Director/ RMO 04-2021	2023-12-31 18:00:48	2023-12-31 18:00:48	NONE	HR
25	FORCED - RANK LIST	Memorandum from the Office of the Commisioner dated November 27, 2023	2024-03-09 18:02:52	2024-03-14 18:02:52	NONE	HR
27	DISPOSAL OF VALUELESS RECORDS	RMO 21-2023	2023-12-31 18:03:59	2023-12-31 18:03:59	NONE	ADMIN
28	STRATEGIC PLAN	RMO 26-2019	2024-04-09 18:04:37	2024-10-14 18:04:37	NONE	ADMIN
29	PLANS AND PROGRAMS	RMO 38-2023 / RMO 31-2022 (Programs and Projects)	2023-12-31 18:05:33	2023-12-31 18:05:33	NONE	ADMIN
30	KPI	RMO 2-2023 	2024-01-24 18:06:09	2024-01-30 18:06:09	NONE	ADMIN
31	OFFICE ACCOMPLISHMENT REPORT	ACCOMPLISHMENT REPORT	2023-12-31 18:06:53	2023-12-31 18:06:53	NONE	ADMIN
32	PROGRESS REPORT	RMO 26-2019	2024-04-09 18:07:40	2024-10-14 18:07:40	NONE	ADMIN
33	OPEN MISSION ORDER	MISSION ORDER	2023-12-31 18:08:11	2023-12-31 18:08:11	NONE	ADMIN
34	ONLINE SURVEY / CRITICAL SERVICES	RMO 14-2023	2024-03-09 18:08:38	2024-03-24 18:08:38	NONE	ADMIN
35	SOCIAL MEDIA TASK FORCE	RMO 7-2022RMO 54-2022	2024-03-09 18:09:12	2024-03-24 18:09:12	NONE	ADMIN
36	OPLAN KANDADO	RMO 03-2009/ RMO 73-2010	2023-12-31 18:09:54	2023-12-31 18:09:54	NONE	ADMIN
12	Daily Time Record (DTR)	RMO 04-2021	2024-06-04 17:17:30	2024-06-09 17:17:30	MONTHLY	HR
14	Office Accomplishment Report	RMO 12-2023 / Memorandum from the Asst. Commissioner of Planning and Management Service	2024-06-04 17:19:15	2024-06-04 17:19:15	MONTHLY	HR
22	Promotable List	RMO 14-2019 / Memorandum from DEPCOM of RMG	2025-02-27 17:58:38	2025-02-27 17:58:38	YEARLY	HR
20	S A L N	RMC 68-2020/ RMO 43-2018	2025-02-08 17:57:21	2025-02-08 17:57:21	YEARLY	HR
11	Current Personnel Strength	Memo of CIR dated January 05, 2016	2024-06-05 11:31:05	2024-06-15 11:31:05	MONTHLY	HR
13	Summary Report of Attendance	RMO 04-2021	2024-06-04 17:18:20	2024-06-09 17:18:20	MONTHLY	HR
26	PERFORMANCE BASED BONUS	RMO 32-2023	2025-03-14 18:03:21	2025-03-30 18:03:21	YEARLY	HR
24	R P C P P E 	Memorandum from DEPCOM of RMG 	2025-01-21 18:02:19	2025-01-21 18:02:19	YEARLY	HR
\.


--
-- Data for Name: SubmittedReports; Type: TABLE DATA; Schema: public; Owner: birmanila
--

COPY public."SubmittedReports" (id, "reportId", "officeId", "dateCreated", "localDue", "nationalDue", files, status, message) FROM stdin;
833	32	1	2024-04-08 16:36:50.186	2024-04-09 16:35:59	2024-04-14 16:35:59	\N	REFERRED	\N
834	32	2	2024-04-08 16:36:50.19	2024-04-09 16:35:59	2024-04-14 16:35:59	\N	REFERRED	\N
835	32	3	2024-04-08 16:36:50.192	2024-04-09 16:35:59	2024-04-14 16:35:59	\N	REFERRED	\N
836	32	4	2024-04-08 16:36:50.194	2024-04-09 16:35:59	2024-04-14 16:35:59	\N	REFERRED	\N
837	32	5	2024-04-08 16:36:50.195	2024-04-09 16:35:59	2024-04-14 16:35:59	\N	REFERRED	\N
838	32	6	2024-04-08 16:36:50.197	2024-04-09 16:35:59	2024-04-14 16:35:59	\N	REFERRED	\N
839	32	7	2024-04-08 16:36:50.199	2024-04-09 16:35:59	2024-04-14 16:35:59	\N	REFERRED	\N
840	32	8	2024-04-08 16:36:50.201	2024-04-09 16:35:59	2024-04-14 16:35:59	\N	REFERRED	\N
841	32	9	2024-04-08 16:36:50.203	2024-04-09 16:35:59	2024-04-14 16:35:59	\N	REFERRED	\N
842	32	10	2024-04-08 16:36:50.205	2024-04-09 16:35:59	2024-04-14 16:35:59	\N	REFERRED	\N
843	32	11	2024-04-08 16:36:50.207	2024-04-09 16:35:59	2024-04-14 16:35:59	\N	REFERRED	\N
844	32	12	2024-04-08 16:36:50.21	2024-04-09 16:35:59	2024-04-14 16:35:59	\N	REFERRED	\N
845	32	13	2024-04-08 16:36:50.212	2024-04-09 16:35:59	2024-04-14 16:35:59	\N	REFERRED	\N
846	32	14	2024-04-08 16:36:50.213	2024-04-09 16:35:59	2024-04-14 16:35:59	\N	REFERRED	\N
847	32	15	2024-04-08 16:36:50.215	2024-04-09 16:35:59	2024-04-14 16:35:59	\N	REFERRED	\N
848	32	16	2024-04-08 16:36:50.217	2024-04-09 16:35:59	2024-04-14 16:35:59	\N	REFERRED	\N
849	12	1	2024-04-10 08:00:00.506	2024-05-04 17:17:30	2024-05-09 17:17:30	\N	REFERRED	\N
850	12	2	2024-04-10 08:00:00.553	2024-05-04 17:17:30	2024-05-09 17:17:30	\N	REFERRED	\N
851	12	3	2024-04-10 08:00:00.557	2024-05-04 17:17:30	2024-05-09 17:17:30	\N	REFERRED	\N
852	12	4	2024-04-10 08:00:00.561	2024-05-04 17:17:30	2024-05-09 17:17:30	\N	REFERRED	\N
853	12	5	2024-04-10 08:00:00.565	2024-05-04 17:17:30	2024-05-09 17:17:30	\N	REFERRED	\N
854	12	6	2024-04-10 08:00:00.569	2024-05-04 17:17:30	2024-05-09 17:17:30	\N	REFERRED	\N
855	12	7	2024-04-10 08:00:00.573	2024-05-04 17:17:30	2024-05-09 17:17:30	\N	REFERRED	\N
856	12	8	2024-04-10 08:00:00.577	2024-05-04 17:17:30	2024-05-09 17:17:30	\N	REFERRED	\N
857	12	9	2024-04-10 08:00:00.58	2024-05-04 17:17:30	2024-05-09 17:17:30	\N	REFERRED	\N
858	12	10	2024-04-10 08:00:00.583	2024-05-04 17:17:30	2024-05-09 17:17:30	\N	REFERRED	\N
859	12	11	2024-04-10 08:00:00.587	2024-05-04 17:17:30	2024-05-09 17:17:30	\N	REFERRED	\N
860	12	12	2024-04-10 08:00:00.59	2024-05-04 17:17:30	2024-05-09 17:17:30	\N	REFERRED	\N
861	12	13	2024-04-10 08:00:00.594	2024-05-04 17:17:30	2024-05-09 17:17:30	\N	REFERRED	\N
862	12	14	2024-04-10 08:00:00.597	2024-05-04 17:17:30	2024-05-09 17:17:30	\N	REFERRED	\N
863	12	15	2024-04-10 08:00:00.601	2024-05-04 17:17:30	2024-05-09 17:17:30	\N	REFERRED	\N
864	12	16	2024-04-10 08:00:00.604	2024-05-04 17:17:30	2024-05-09 17:17:30	\N	REFERRED	\N
865	13	1	2024-04-10 08:00:00.607	2024-05-04 17:18:20	2024-05-09 17:18:20	\N	REFERRED	\N
866	13	2	2024-04-10 08:00:00.61	2024-05-04 17:18:20	2024-05-09 17:18:20	\N	REFERRED	\N
867	13	3	2024-04-10 08:00:00.614	2024-05-04 17:18:20	2024-05-09 17:18:20	\N	REFERRED	\N
868	13	4	2024-04-10 08:00:00.618	2024-05-04 17:18:20	2024-05-09 17:18:20	\N	REFERRED	\N
869	13	5	2024-04-10 08:00:00.621	2024-05-04 17:18:20	2024-05-09 17:18:20	\N	REFERRED	\N
870	13	6	2024-04-10 08:00:00.624	2024-05-04 17:18:20	2024-05-09 17:18:20	\N	REFERRED	\N
871	13	7	2024-04-10 08:00:00.627	2024-05-04 17:18:20	2024-05-09 17:18:20	\N	REFERRED	\N
872	13	8	2024-04-10 08:00:00.63	2024-05-04 17:18:20	2024-05-09 17:18:20	\N	REFERRED	\N
873	13	9	2024-04-10 08:00:00.633	2024-05-04 17:18:20	2024-05-09 17:18:20	\N	REFERRED	\N
874	13	10	2024-04-10 08:00:00.636	2024-05-04 17:18:20	2024-05-09 17:18:20	\N	REFERRED	\N
875	13	11	2024-04-10 08:00:00.64	2024-05-04 17:18:20	2024-05-09 17:18:20	\N	REFERRED	\N
876	13	12	2024-04-10 08:00:00.643	2024-05-04 17:18:20	2024-05-09 17:18:20	\N	REFERRED	\N
877	13	13	2024-04-10 08:00:00.646	2024-05-04 17:18:20	2024-05-09 17:18:20	\N	REFERRED	\N
878	13	14	2024-04-10 08:00:00.649	2024-05-04 17:18:20	2024-05-09 17:18:20	\N	REFERRED	\N
879	13	15	2024-04-10 08:00:00.652	2024-05-04 17:18:20	2024-05-09 17:18:20	\N	REFERRED	\N
880	13	16	2024-04-10 08:00:00.656	2024-05-04 17:18:20	2024-05-09 17:18:20	\N	REFERRED	\N
881	11	1	2024-04-16 08:00:00.117	2024-05-05 11:31:05	2024-05-15 11:31:05	\N	REFERRED	\N
882	11	2	2024-04-16 08:00:00.126	2024-05-05 11:31:05	2024-05-15 11:31:05	\N	REFERRED	\N
883	11	3	2024-04-16 08:00:00.13	2024-05-05 11:31:05	2024-05-15 11:31:05	\N	REFERRED	\N
884	11	4	2024-04-16 08:00:00.134	2024-05-05 11:31:05	2024-05-15 11:31:05	\N	REFERRED	\N
885	11	5	2024-04-16 08:00:00.138	2024-05-05 11:31:05	2024-05-15 11:31:05	\N	REFERRED	\N
886	11	6	2024-04-16 08:00:00.142	2024-05-05 11:31:05	2024-05-15 11:31:05	\N	REFERRED	\N
887	11	7	2024-04-16 08:00:00.151	2024-05-05 11:31:05	2024-05-15 11:31:05	\N	REFERRED	\N
888	11	8	2024-04-16 08:00:00.155	2024-05-05 11:31:05	2024-05-15 11:31:05	\N	REFERRED	\N
889	11	9	2024-04-16 08:00:00.159	2024-05-05 11:31:05	2024-05-15 11:31:05	\N	REFERRED	\N
890	11	10	2024-04-16 08:00:00.163	2024-05-05 11:31:05	2024-05-15 11:31:05	\N	REFERRED	\N
891	11	11	2024-04-16 08:00:00.166	2024-05-05 11:31:05	2024-05-15 11:31:05	\N	REFERRED	\N
892	11	12	2024-04-16 08:00:00.169	2024-05-05 11:31:05	2024-05-15 11:31:05	\N	REFERRED	\N
893	11	13	2024-04-16 08:00:00.172	2024-05-05 11:31:05	2024-05-15 11:31:05	\N	REFERRED	\N
894	11	14	2024-04-16 08:00:00.176	2024-05-05 11:31:05	2024-05-15 11:31:05	\N	REFERRED	\N
895	11	15	2024-04-16 08:00:00.179	2024-05-05 11:31:05	2024-05-15 11:31:05	\N	REFERRED	\N
896	11	16	2024-04-16 08:00:00.183	2024-05-05 11:31:05	2024-05-15 11:31:05	\N	REFERRED	\N
897	14	1	2024-05-06 08:00:00.186	2024-06-04 17:19:15	2024-06-04 17:19:15	\N	REFERRED	\N
898	14	2	2024-05-06 08:00:00.206	2024-06-04 17:19:15	2024-06-04 17:19:15	\N	REFERRED	\N
899	14	3	2024-05-06 08:00:00.211	2024-06-04 17:19:15	2024-06-04 17:19:15	\N	REFERRED	\N
900	14	4	2024-05-06 08:00:00.218	2024-06-04 17:19:15	2024-06-04 17:19:15	\N	REFERRED	\N
901	14	5	2024-05-06 08:00:00.225	2024-06-04 17:19:15	2024-06-04 17:19:15	\N	REFERRED	\N
902	14	6	2024-05-06 08:00:00.232	2024-06-04 17:19:15	2024-06-04 17:19:15	\N	REFERRED	\N
903	14	7	2024-05-06 08:00:00.24	2024-06-04 17:19:15	2024-06-04 17:19:15	\N	REFERRED	\N
904	14	8	2024-05-06 08:00:00.251	2024-06-04 17:19:15	2024-06-04 17:19:15	\N	REFERRED	\N
905	14	9	2024-05-06 08:00:00.261	2024-06-04 17:19:15	2024-06-04 17:19:15	\N	REFERRED	\N
906	14	10	2024-05-06 08:00:00.266	2024-06-04 17:19:15	2024-06-04 17:19:15	\N	REFERRED	\N
907	14	11	2024-05-06 08:00:00.272	2024-06-04 17:19:15	2024-06-04 17:19:15	\N	REFERRED	\N
908	14	12	2024-05-06 08:00:00.28	2024-06-04 17:19:15	2024-06-04 17:19:15	\N	REFERRED	\N
909	14	13	2024-05-06 08:00:00.29	2024-06-04 17:19:15	2024-06-04 17:19:15	\N	REFERRED	\N
910	14	14	2024-05-06 08:00:00.296	2024-06-04 17:19:15	2024-06-04 17:19:15	\N	REFERRED	\N
911	14	15	2024-05-06 08:00:00.309	2024-06-04 17:19:15	2024-06-04 17:19:15	\N	REFERRED	\N
912	14	16	2024-05-06 08:00:00.317	2024-06-04 17:19:15	2024-06-04 17:19:15	\N	REFERRED	\N
913	13	1	2024-05-10 08:00:00.408	2024-06-04 17:18:20	2024-06-09 17:18:20	\N	REFERRED	\N
914	13	2	2024-05-10 08:00:00.43	2024-06-04 17:18:20	2024-06-09 17:18:20	\N	REFERRED	\N
915	13	3	2024-05-10 08:00:00.434	2024-06-04 17:18:20	2024-06-09 17:18:20	\N	REFERRED	\N
916	13	4	2024-05-10 08:00:00.438	2024-06-04 17:18:20	2024-06-09 17:18:20	\N	REFERRED	\N
917	13	5	2024-05-10 08:00:00.442	2024-06-04 17:18:20	2024-06-09 17:18:20	\N	REFERRED	\N
918	13	6	2024-05-10 08:00:00.447	2024-06-04 17:18:20	2024-06-09 17:18:20	\N	REFERRED	\N
919	13	7	2024-05-10 08:00:00.45	2024-06-04 17:18:20	2024-06-09 17:18:20	\N	REFERRED	\N
920	13	8	2024-05-10 08:00:00.454	2024-06-04 17:18:20	2024-06-09 17:18:20	\N	REFERRED	\N
921	13	9	2024-05-10 08:00:00.458	2024-06-04 17:18:20	2024-06-09 17:18:20	\N	REFERRED	\N
922	13	10	2024-05-10 08:00:00.462	2024-06-04 17:18:20	2024-06-09 17:18:20	\N	REFERRED	\N
923	13	11	2024-05-10 08:00:00.465	2024-06-04 17:18:20	2024-06-09 17:18:20	\N	REFERRED	\N
924	13	12	2024-05-10 08:00:00.469	2024-06-04 17:18:20	2024-06-09 17:18:20	\N	REFERRED	\N
925	13	13	2024-05-10 08:00:00.472	2024-06-04 17:18:20	2024-06-09 17:18:20	\N	REFERRED	\N
926	13	14	2024-05-10 08:00:00.476	2024-06-04 17:18:20	2024-06-09 17:18:20	\N	REFERRED	\N
927	13	15	2024-05-10 08:00:00.479	2024-06-04 17:18:20	2024-06-09 17:18:20	\N	REFERRED	\N
928	13	16	2024-05-10 08:00:00.482	2024-06-04 17:18:20	2024-06-09 17:18:20	\N	REFERRED	\N
929	12	1	2024-05-10 08:00:00.486	2024-06-04 17:17:30	2024-06-09 17:17:30	\N	REFERRED	\N
930	12	2	2024-05-10 08:00:00.49	2024-06-04 17:17:30	2024-06-09 17:17:30	\N	REFERRED	\N
931	12	3	2024-05-10 08:00:00.493	2024-06-04 17:17:30	2024-06-09 17:17:30	\N	REFERRED	\N
932	12	4	2024-05-10 08:00:00.496	2024-06-04 17:17:30	2024-06-09 17:17:30	\N	REFERRED	\N
933	12	5	2024-05-10 08:00:00.499	2024-06-04 17:17:30	2024-06-09 17:17:30	\N	REFERRED	\N
934	12	6	2024-05-10 08:00:00.503	2024-06-04 17:17:30	2024-06-09 17:17:30	\N	REFERRED	\N
935	12	7	2024-05-10 08:00:00.506	2024-06-04 17:17:30	2024-06-09 17:17:30	\N	REFERRED	\N
936	12	8	2024-05-10 08:00:00.51	2024-06-04 17:17:30	2024-06-09 17:17:30	\N	REFERRED	\N
937	12	9	2024-05-10 08:00:00.513	2024-06-04 17:17:30	2024-06-09 17:17:30	\N	REFERRED	\N
938	12	10	2024-05-10 08:00:00.516	2024-06-04 17:17:30	2024-06-09 17:17:30	\N	REFERRED	\N
939	12	11	2024-05-10 08:00:00.519	2024-06-04 17:17:30	2024-06-09 17:17:30	\N	REFERRED	\N
940	12	12	2024-05-10 08:00:00.523	2024-06-04 17:17:30	2024-06-09 17:17:30	\N	REFERRED	\N
941	12	13	2024-05-10 08:00:00.526	2024-06-04 17:17:30	2024-06-09 17:17:30	\N	REFERRED	\N
942	12	14	2024-05-10 08:00:00.529	2024-06-04 17:17:30	2024-06-09 17:17:30	\N	REFERRED	\N
943	12	15	2024-05-10 08:00:00.532	2024-06-04 17:17:30	2024-06-09 17:17:30	\N	REFERRED	\N
944	12	16	2024-05-10 08:00:00.535	2024-06-04 17:17:30	2024-06-09 17:17:30	\N	REFERRED	\N
945	11	1	2024-05-16 08:00:00.34	2024-06-05 11:31:05	2024-06-15 11:31:05	\N	REFERRED	\N
946	11	2	2024-05-16 08:00:00.365	2024-06-05 11:31:05	2024-06-15 11:31:05	\N	REFERRED	\N
947	11	3	2024-05-16 08:00:00.37	2024-06-05 11:31:05	2024-06-15 11:31:05	\N	REFERRED	\N
948	11	4	2024-05-16 08:00:00.374	2024-06-05 11:31:05	2024-06-15 11:31:05	\N	REFERRED	\N
949	11	5	2024-05-16 08:00:00.378	2024-06-05 11:31:05	2024-06-15 11:31:05	\N	REFERRED	\N
950	11	6	2024-05-16 08:00:00.382	2024-06-05 11:31:05	2024-06-15 11:31:05	\N	REFERRED	\N
951	11	7	2024-05-16 08:00:00.386	2024-06-05 11:31:05	2024-06-15 11:31:05	\N	REFERRED	\N
952	11	8	2024-05-16 08:00:00.39	2024-06-05 11:31:05	2024-06-15 11:31:05	\N	REFERRED	\N
953	11	9	2024-05-16 08:00:00.393	2024-06-05 11:31:05	2024-06-15 11:31:05	\N	REFERRED	\N
954	11	10	2024-05-16 08:00:00.397	2024-06-05 11:31:05	2024-06-15 11:31:05	\N	REFERRED	\N
955	11	11	2024-05-16 08:00:00.401	2024-06-05 11:31:05	2024-06-15 11:31:05	\N	REFERRED	\N
956	11	12	2024-05-16 08:00:00.405	2024-06-05 11:31:05	2024-06-15 11:31:05	\N	REFERRED	\N
957	11	13	2024-05-16 08:00:00.408	2024-06-05 11:31:05	2024-06-15 11:31:05	\N	REFERRED	\N
958	11	14	2024-05-16 08:00:00.412	2024-06-05 11:31:05	2024-06-15 11:31:05	\N	REFERRED	\N
959	11	15	2024-05-16 08:00:00.416	2024-06-05 11:31:05	2024-06-15 11:31:05	\N	REFERRED	\N
960	11	16	2024-05-16 08:00:00.42	2024-06-05 11:31:05	2024-06-15 11:31:05	\N	REFERRED	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: birmanila
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
162fdc9b-c99e-4ce6-9391-f0852d39c11e	35edf9f60e70a5ffebd84522a85312e25f3b06cc767c09748efff56165699129	2024-04-08 16:11:37.17935+00	20240408024349_password_nullable	\N	\N	2024-04-08 16:11:37.174871+00	1
bbf29db4-ec29-4164-877c-4159bd1c9164	e6d004d7c31b58b6247536f5b2bf7cf01e8f2f8515b96a39c1c83370e0bf316b	2024-02-15 00:04:22.84995+00	20240209003226_document_initial	\N	\N	2024-02-15 00:04:22.768343+00	1
3ca23cbd-bf64-4dec-8b66-dd0bbe4628f9	3373cce5afdadc87fbf9b387a1597e891ce2f9e43a2c198f80c21c46cf1485f2	2024-02-17 11:06:50.473145+00	20240216222946_events_initial	\N	\N	2024-02-17 11:06:50.456837+00	1
ff764566-7570-479e-a0c0-c3112fc51e82	babdc0d0d9dce96acf8bb318027e5765246efa15f3757ce35eb897beeb38c348	2024-02-15 00:04:22.857417+00	20240209020619_comments_added_sender	\N	\N	2024-02-15 00:04:22.85261+00	1
83465a49-5277-4bfd-b1db-07b3549d9993	745522bbff084c4e6bd123d71ae033d862e22e15f5608c8ba4a6c71461d88a1b	2024-02-15 00:04:22.864398+00	20240209021104_documents_added_tag	\N	\N	2024-02-15 00:04:22.860059+00	1
42a846d9-662b-41fa-8ff4-f3ba663a206e	df902cb47f32edefb3dee24aee39576cc472e9395ade4a9d829b096b5aa1327e	2024-04-08 16:11:37.13031+00	20240405092853_document_update	\N	\N	2024-04-08 16:11:37.08568+00	1
fcc170fe-8256-4ebb-89a4-2437dfbb7484	0349c6725d51ffe4ab7b1b41b65aa72d2fe2f4e17008d537d58c0a2392f7c144	2024-02-15 00:04:22.883079+00	20240209024422_comments_added_datecreated	\N	\N	2024-02-15 00:04:22.878783+00	1
057b9736-6560-48da-af6e-174627ba6859	4ebb86a85a81872803b37186ac791f935a84a060bf6ed3796536b23ce35cdc45	2024-02-17 17:15:13.811487+00	20240217133241_frequency_removed_weekly_and_quarterly	\N	\N	2024-02-17 17:15:13.78461+00	1
d85d185f-4609-4b22-8261-00f7ad2366fb	37550355b9cb087e3695d4a7618a6a2581837bcfae82a34a2516624cb9a90fd9	2024-02-15 00:04:22.892063+00	20240212004821_offices_removed_sections	\N	\N	2024-02-15 00:04:22.885706+00	1
1c26b736-c6fe-4538-9aec-bb4a7bbcdd80	0072be42943586ec4c6d98f897714765caacef8dee9785a981f4daceca4f819f	2024-02-15 00:04:22.90163+00	20240212090812_role_added_roles	\N	\N	2024-02-15 00:04:22.897702+00	1
67001152-31fe-4d62-be39-8c336f4c3c3b	4e0fa31c502681d85d27622433dade132403d95f5d73b0462ce74938c29f3202	2024-02-15 00:04:22.924942+00	20240213090119_reports_initial	\N	\N	2024-02-15 00:04:22.904573+00	1
e39c40b4-757c-43cb-9730-824c1d52c14f	8e3a9ced80d72f9426a684759fec9591621cde8243f2cb096543d0422fb43e00	2024-02-27 13:57:48.330045+00	20240227014214_added_2_step_verification	\N	\N	2024-02-27 13:57:48.312804+00	1
544d0002-29c4-4940-b191-69b0b2a3e4bf	d738e4257088c98a7423706ab3e41ddfbb2f957bb781d3da68de7a108f4974df	2024-02-15 00:04:22.931543+00	20240213091832_reports_added_message	\N	\N	2024-02-15 00:04:22.927346+00	1
03500024-94fe-4947-aa17-75fdcfeba565	8040978b2be76934ecc37db43c11f7e3d5d2684ef5a58a9ae48ddd9cc312de35	2024-02-15 00:04:22.937836+00	20240214011056_report_added_frequency	\N	\N	2024-02-15 00:04:22.934058+00	1
e16bf0e8-0821-4072-9342-fe4f26fe9f4b	b519d41e595dfaf8e5b17b29126f9c5f22c27ffe10920fff6e24c8eb88f31235	2024-02-15 00:04:22.944386+00	20240214021044_officers_added_device	\N	\N	2024-02-15 00:04:22.940317+00	1
50c6f06d-862a-4dc3-803f-e0e3e58d72e6	ab4944e3f23658e12363ac27a64af91839bee9442532ba1e40252073f787824f	2024-02-27 13:57:48.336655+00	20240227015809_officers_added_phone_and_email	\N	\N	2024-02-27 13:57:48.332353+00	1
33c73529-8844-42a6-aaa9-3dd9e509a2d4	d16a35e33b7fd9b1ee3c17b0782b169a5c4b48f6d5264d3035f13e2095491039	2024-02-15 00:04:22.951856+00	20240214162038_officers_added_avatar	\N	\N	2024-02-15 00:04:22.947118+00	1
b5b28f58-0437-4d85-b6d6-175aa1add830	bb0d63114cbb56621ac31743e77bebf09a419ac0202339f885da1c7d7b704bbc	2024-02-17 11:06:50.448119+00	20240216002808_documents_signature	\N	\N	2024-02-17 11:06:50.436878+00	1
7799c9d2-56a9-440f-b7ec-6eede7c6c21f	545b3f67fb357edf312469ffe3fc5434ade01c122bdcd79be4fef9eeca52c466	2024-04-08 16:11:37.137105+00	20240405110017_comments_added_message	\N	\N	2024-04-08 16:11:37.132702+00	1
cf17484d-3549-4b34-b193-8b07d927e560	416df599afe9c55e45515674ee0de1045eb1a2a60c56a8334c397d01c46a4cdb	2024-02-17 11:06:50.4553+00	20240216101818_reports_added_type	\N	\N	2024-02-17 11:06:50.449805+00	1
214effc7-eaf9-435f-8560-df14e78b64ab	ed6e65fd71d2ed93ffd3c359ce4905086aeddb2ed9f2ef41151df97f552ef62d	2024-02-27 13:57:48.34983+00	20240227015848_officers_added_verification	\N	\N	2024-02-27 13:57:48.338602+00	1
79372adf-ec46-4638-b710-b82030d2e5a4	3f0e3245d168efeaa483d519f27d155f2a778e1b9c800ede60612de9237d4a6d	2024-02-27 13:57:48.377093+00	20240227091058_officers_email_and_phone_unique	\N	\N	2024-02-27 13:57:48.352154+00	1
26981767-918e-4aca-a655-56abbd1bb8c6	3e39903fb98e2301fa74278a469f1fe2afae0821e664f017b92a0ae30afec18b	2024-02-27 13:57:48.385796+00	20240227100340_officers_unique_firstname_and_lastname	\N	\N	2024-02-27 13:57:48.378984+00	1
3f5c71f5-d013-46bc-8866-a92180dee1aa	0349c6725d51ffe4ab7b1b41b65aa72d2fe2f4e17008d537d58c0a2392f7c144	2024-04-08 16:11:37.145203+00	20240405110126_comments_added_timestamp	\N	\N	2024-04-08 16:11:37.139042+00	1
21b45536-4276-4a4b-946f-a2f1f99de784	f8aeb1e18406977d201e052f8ffb16d50c1b77d71f2f1690225c239486156463	2024-04-08 16:11:37.083799+00	20240330105053_document_status_moved_to_recipients	\N	\N	2024-04-08 16:11:37.004027+00	1
8a8b7ffd-2b4a-4dfe-a779-1c0c92172513	e0de3d5204ebe87144adf762a76930a181f329a835bc3a4c370b30e6353ccc18	2024-04-08 16:11:37.151415+00	20240405110316_assigned_added_default	\N	\N	2024-04-08 16:11:37.147009+00	1
0305f552-bef0-4e30-a30f-22df728a64c6	7a744a32ad5c3f88aa56eb8a7981b6cb5c5254e75ec7a835e71f7f84282b98f6	2024-04-08 16:11:37.17247+00	20240405111843_enum_status_updated	\N	\N	2024-04-08 16:11:37.152873+00	1
\.


--
-- Name: Comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: birmanila
--

SELECT pg_catalog.setval('public."Comments_id_seq"', 17, true);


--
-- Name: DocumentPurpose_id_seq; Type: SEQUENCE SET; Schema: public; Owner: birmanila
--

SELECT pg_catalog.setval('public."DocumentPurpose_id_seq"', 19, true);


--
-- Name: DocumentStatus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: birmanila
--

SELECT pg_catalog.setval('public."DocumentStatus_id_seq"', 13, true);


--
-- Name: DocumentTypes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: birmanila
--

SELECT pg_catalog.setval('public."DocumentTypes_id_seq"', 22, true);


--
-- Name: Events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: birmanila
--

SELECT pg_catalog.setval('public."Events_id_seq"', 8, true);


--
-- Name: Offices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: birmanila
--

SELECT pg_catalog.setval('public."Offices_id_seq"', 19, true);


--
-- Name: Positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: birmanila
--

SELECT pg_catalog.setval('public."Positions_id_seq"', 13, true);


--
-- Name: Reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: birmanila
--

SELECT pg_catalog.setval('public."Reports_id_seq"', 37, true);


--
-- Name: SubmittedReports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: birmanila
--

SELECT pg_catalog.setval('public."SubmittedReports_id_seq"', 960, true);


--
-- Name: Assigned Assigned_pkey; Type: CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Assigned"
    ADD CONSTRAINT "Assigned_pkey" PRIMARY KEY ("officerId", "documentId");


--
-- Name: Comments Comments_pkey; Type: CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_pkey" PRIMARY KEY (id);


--
-- Name: DocumentPurpose DocumentPurpose_pkey; Type: CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."DocumentPurpose"
    ADD CONSTRAINT "DocumentPurpose_pkey" PRIMARY KEY (id);


--
-- Name: DocumentStatus DocumentStatus_pkey; Type: CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."DocumentStatus"
    ADD CONSTRAINT "DocumentStatus_pkey" PRIMARY KEY (id);


--
-- Name: DocumentTypes DocumentTypes_pkey; Type: CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."DocumentTypes"
    ADD CONSTRAINT "DocumentTypes_pkey" PRIMARY KEY (id);


--
-- Name: Documents Documents_pkey; Type: CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_pkey" PRIMARY KEY ("referenceNum");


--
-- Name: Events Events_pkey; Type: CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Events"
    ADD CONSTRAINT "Events_pkey" PRIMARY KEY (id);


--
-- Name: Officers Officers_pkey; Type: CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Officers"
    ADD CONSTRAINT "Officers_pkey" PRIMARY KEY (uuid);


--
-- Name: Offices Offices_pkey; Type: CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Offices"
    ADD CONSTRAINT "Offices_pkey" PRIMARY KEY (id);


--
-- Name: Positions Positions_pkey; Type: CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Positions"
    ADD CONSTRAINT "Positions_pkey" PRIMARY KEY (id);


--
-- Name: Referrals Referrals_pkey; Type: CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Referrals"
    ADD CONSTRAINT "Referrals_pkey" PRIMARY KEY ("officeId", "documentId");


--
-- Name: Reports Reports_pkey; Type: CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Reports"
    ADD CONSTRAINT "Reports_pkey" PRIMARY KEY (id);


--
-- Name: SubmittedReports SubmittedReports_pkey; Type: CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."SubmittedReports"
    ADD CONSTRAINT "SubmittedReports_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Officers_email_key; Type: INDEX; Schema: public; Owner: birmanila
--

CREATE UNIQUE INDEX "Officers_email_key" ON public."Officers" USING btree (email);


--
-- Name: Officers_firstName_lastName_key; Type: INDEX; Schema: public; Owner: birmanila
--

CREATE UNIQUE INDEX "Officers_firstName_lastName_key" ON public."Officers" USING btree ("firstName", "lastName");


--
-- Name: Officers_phone_key; Type: INDEX; Schema: public; Owner: birmanila
--

CREATE UNIQUE INDEX "Officers_phone_key" ON public."Officers" USING btree (phone);


--
-- Name: Assigned Assigned_documentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Assigned"
    ADD CONSTRAINT "Assigned_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES public."Documents"("referenceNum") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Assigned Assigned_officerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Assigned"
    ADD CONSTRAINT "Assigned_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES public."Officers"(uuid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comments Comments_documentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Comments"
    ADD CONSTRAINT "Comments_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES public."Documents"("referenceNum") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Documents Documents_purposeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_purposeId_fkey" FOREIGN KEY ("purposeId") REFERENCES public."DocumentPurpose"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Documents Documents_signatureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_signatureId_fkey" FOREIGN KEY ("signatureId") REFERENCES public."Officers"(uuid) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Documents Documents_typeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES public."DocumentTypes"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Officers Officers_officeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Officers"
    ADD CONSTRAINT "Officers_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES public."Offices"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Officers Officers_positionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Officers"
    ADD CONSTRAINT "Officers_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES public."Positions"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Referrals Referrals_documentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Referrals"
    ADD CONSTRAINT "Referrals_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES public."Documents"("referenceNum") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Referrals Referrals_officeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Referrals"
    ADD CONSTRAINT "Referrals_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES public."Offices"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Referrals Referrals_statusId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."Referrals"
    ADD CONSTRAINT "Referrals_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES public."DocumentStatus"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SubmittedReports SubmittedReports_officeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."SubmittedReports"
    ADD CONSTRAINT "SubmittedReports_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES public."Offices"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SubmittedReports SubmittedReports_reportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: birmanila
--

ALTER TABLE ONLY public."SubmittedReports"
    ADD CONSTRAINT "SubmittedReports_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES public."Reports"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

