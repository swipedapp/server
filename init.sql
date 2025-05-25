create table devices
(
	authkey         integer                           not null,
	settingstate    integer default 1                 not null,
	created_at      integer default current_timestamp not null,
	updated_at      integer default current_timestamp not null,
	total_kept      integer default 0                 not null,
	total_deleted   integer default 0                 not null,
	total_photo_deleted integer default 0               not null,
	total_video_deleted integer default 0               not null,
	space_saved     integer default 0                 not null,
	swipe_score     integer default 0                 not null
);
