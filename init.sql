create table devices
(
	authkey         integer                           not null,
	settingstate	integer  default 1                not null,
	created_at      integer default current_timestamp not null,
	updated_at      integer default current_timestamp not null,
	size		  integer       default 0             not null
);
