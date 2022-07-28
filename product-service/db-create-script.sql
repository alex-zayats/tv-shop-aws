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


insert into public.stocks (product_id, count) values 
('5e232611-81f0-4414-9c6e-a477f233ee14', 20),
('224b86b4-6d82-4ac2-a2af-6b2824e09c3b', 10),
('92eb6630-56cd-41b2-b0aa-6d0fb1cf202c', 30),
('e23a783d-b92d-4971-b4c6-4293d897262f', 50),
('8058aecd-5bb4-4b18-9c23-f3f5e0442d93', 30),
('c5311bb7-44b0-4656-b6e8-8d2efcf4ab50', 30),
('5d52cd6f-e882-4f3a-9ad1-65fd187becf2', 30),
('75eaffdc-c869-4886-b8af-6fde389c9c06', 30)