create database if not exists ScheduleManagerDB;

use ScheduleManagerDB;

drop table if exists user;
drop table if exists schedule;
drop user if exists 'ScheduleManager'@'localhost';

create table user(
	user_id varchar(1024) primary key,
	user_name varchar(1024) not null,
	password varchar(1024) not null
)DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

create table schedule(
	schedule_id varchar(1024) primary key,
	user_id varchar(1024) not null,
	title varchar(1024) not null,
	description text,
	start_date datetime not null,
	end_date datetime not null
)DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;


CREATE USER 'ScheduleManager'@'localhost' IDENTIFIED BY '123456';
flush privileges;
grant all privileges on ScheduleManagerDB.* to ScheduleManager@localhost;
flush privileges;