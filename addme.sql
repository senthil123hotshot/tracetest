create database trace;
use trace;
create table userinfo(id int autoincrement primary key,username varchar(100),password varchar(100));
create table folder(id int auto increment primary key,name varchar(100),created date);
create table textstore(id int auto increment primary key,info text,link text,foldername varchar(100));
