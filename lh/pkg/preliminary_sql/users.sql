UPDATE public.auth_user
	SET password='pbkdf2_sha256$150000$3dKTOAbIE52t$8YllRoSh1fHNOTOzm8Ux0v8Vcn/k0QJc3ZQWK9CL40A='
	WHERE id=1;

INSERT INTO public.auth_user(
	id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
	VALUES
('3','pbkdf2_sha256$150000$xWlYtj92hQd9$4f30f1HqyVU87h/4idcRgTQXY5X1NgK4uUpXtSSDTNw=',current_timestamp,'t','glamcloud','Thomas','Wikman','','t','t',current_timestamp),
('8','pbkdf2_sha256$150000$fv0yPfKkfQn5$ntK1saY2iq97UQrR+2Y8un91yDo9leDSuUsSfRChNsA=',current_timestamp,'t','henk','','','','t','t','2021-08-11 09:53:27+02'),
('6','pbkdf2_sha256$150000$CExDy20xeRj7$lCwy8q4xb48HVrRDyIaHeTHGUYyat3KbZ4Fk/0X53VI=',current_timestamp,'t','sjoerd','','','','t','t','2021-08-11 09:52:32+02'),
('13','pbkdf2_sha256$150000$U8x5E7SWHNFc$K11Gxwi1b/grsQoL6NY4Y6sgqg/hW1vElFnFYPLM/C4=',current_timestamp,'f','RDMAdministrator','RDMAdministrator','RDMAdministrator','','t','t','2021-08-11 10:52:37+02'),
('5','pbkdf2_sha256$150000$Pwq348Az1lmI$WKX85KGNyJokS1bNLYjxZWQpyDjq/z1uVh3+GVLlcBA=',current_timestamp,'t','sds','','','','t','t','2021-08-11 09:52:08+02'),
('7','pbkdf2_sha256$150000$4b5kqvVNkCDs$O4rYMA8gXE3FGq4ri9nr3Ao78i2VAZfb11D6lF0LzYg=',current_timestamp,'t','luc','','','','t','t','2021-08-11 09:53:07+02'),
('14','pbkdf2_sha256$150000$LknDQnPUoByW$lt+nAWfjBC83lMbr+w5MP5UgqE9GhIzM+vea5KyRr5U=',current_timestamp,'f','ResourceReviewer','ResourceReviewer','ResourceReviewer','','t','t','2021-08-11 10:53:22+02'),
('10','pbkdf2_sha256$150000$o65YqOon0grC$PNBE3KiUCeTH5bl+mlMPr9ESycBDv/OOmyW0dSWhsS0=',current_timestamp,'f','CrowdSourceEditor','CrowdSourceEditor','CrowdSourceEditor','','t','t','2021-08-11 10:50:45+02'),
('11','pbkdf2_sha256$150000$Lr6wvScqDTI2$c9lkTJORwiUSxwBG4ZTZgi8mtTlXcFUH7JU7o3+/OJ0=',current_timestamp,'f','GraphEditor','GraphEditor','GraphEditor','','t','t','2021-08-11 10:51:25+02'),
('12','pbkdf2_sha256$150000$LscAAXC6Ty7m$fK0GisUjwoZg+SELNP6DzyEEI5hk0N77bNhNrLlXvlc=',current_timestamp,'f','MobileProjectAdministrator','MobileProjectAdministrator','MobileProjectAdministrator','','t','t','2021-08-11 10:51:58+02'),
('15','pbkdf2_sha256$150000$V0Apil5Hdr9X$459VSi4GVJ27FrWeD+KCwbChNCEcSG1+L1W/MO51CwA=',current_timestamp,'f','SystemAdministrator','SystemAdministrator','SystemAdministrator','','t','t','2021-08-11 10:53:59+02'),
('9','pbkdf2_sha256$150000$2XW5cbrfjzcU$cGACF4ftIUbpPtFfzTAbr2cJypBtFTNDiVNgNNvDQhY=',current_timestamp,'f','ResourceEditor','ResourceEditor','ResourceEditor','','t','t','2021-08-11 10:47:47+02'),
('4','pbkdf2_sha256$150000$IcZO68EMjFNE$cGceFTRLb/zRQ7FnfeBbgTfx8bQaOdiYPujZx09b6wk=',current_timestamp,'t','philbox','','','','t','t','2021-08-11 09:51:35+02');

INSERT INTO public.auth_user_groups(
    id, user_id, group_id)
    VALUES
(11,3,1), (12,3,2), (13,3,3), (14,3,4), (15,3,5), (16,3,6), (17,3,7), (18,3,8), (19,3,9),
(20,4,1),(21,4,2),(22,4,3),(23,4,4),(24,4,5),(25,4,6),(26,4,7),(27,4,8),(28,4,9),
(29,5,1),(30,5,2),(31,5,3),(32,5,4),(33,5,5),(34,5,6),(35,5,7),(36,5,8),(37,5,9),
(38,6,1),(39,6,2),(40,6,3),(41,6,4),(42,6,5),(43,6,6),(44,6,7),(45,6,8),(46,6,9),
(47,7,1),(48,7,2),(49,7,3),(50,7,4),(51,7,5),(52,7,6),(53,7,7),(54,7,8),(55,7,9),
(56,8,1),(57,8,2),(58,8,3),(59,8,4),(60,8,5),(61,8,6),(62,8,7),(63,8,8),(64,8,9),
(65,9,2),(66,10,7),(67,11,1),(68,12,6),(69,13,3),(70,14,9),(71,15,5);