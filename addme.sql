create database trace;
use trace;
create table userinfo(id int auto increment primary key,username varchar(100),password varchar(100));
create table folder(id int auto increment primary key,name varchar(100),created date,FOREIGN KEY (id) REFERENCES userinfo(id)
);
create table textstore(id int auto increment primary key,info text,link text,foldername varchar(100) ,FOREIGN KEY (id) REFERENCES userinfo(id));
