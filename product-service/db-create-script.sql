create extension if not exists "uuid-ossp"

create table public.products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price integer
)

create table public.stocks (
	product_id uuid,
	count integer,
	foreign key ("product_id") references "products" ("id")
)

insert into public.products (description, price, title) values 
('58'' 3840x2160 (4K UHD)', 2400, 'Philips 58PUS8506'),
('50'' 3840x2160 (4K UHD)', 2000, 'Philips 50PUS8506'),
('50'' 3840x2160 (4K UHD)', 1700, 'Xiaomi MI TV P1 50'),
('55'' 3840x2160 (4K UHD) OLED', 14000, 'LG OLED55C1RLA'),
('32'' 1920x1080 (Full HD)', 1500, 'Samsung UE32T5300AU'),
('50'' 3840x2160 (4K UHD) VA', 2200, 'LG 50UP75006LF'),
('43'' 3840x2160 (4K UHD) IPS', 2300, 'LG 43NANO776PA'),
('32'' 1366x768 (HD) VA', 700, 'Blaupunkt 32WB965')


--insert into stocks (product_id, count) values 
--('7567ec4b-b10c-48c5-9345-fc73348a80a1', 2000),
--('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 1000),
--('7567ec4b-b10c-48c5-9345-fc73c48a80a0', 3000),
--('7567ec4b-b10c-48c5-9445-fc73c48a80a2', 5000)