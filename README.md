# RemoteControl

使用Server:Google Cloud Platform 12個月試用期

虛擬機作業系統:Ubuntu

Server IP:http://35.229.75.244

使用語言:Jquery、PHP、Mysql、Go

用途:用於線上遠端控制Nodemcu晶片輸出。

連線方式:

利用SSH開啟命令列。

以下為命令列執行內容:

#Install

root@server:~# apt update

root@server:~# apt upgrade

root@server:~# apt install apache2 php php-mbstring php-cli php-gd php-json php-curl php-mysql php-mysqli -y

root@server:~# apt install unzip git golang wget curl mysql-server -y

root@server:~# service apache2 restart

#MySQL

root@server:~# mysql_secure_installation 

#(Details, and don't install VALIDATE PASSWORD PLUGIN.)

root@server:~# mysql -u root -p

mysql> CREATE USER 'hc'@'localhost' IDENTIFIED BY '123456789';

mysql> GRANT ALL PRIVILEGES ON *.* TO 'hc'@'localhost' WITH GRANT OPTION;

mysql> FLUSH PRIVILEGES;

mysql> quit

#phpMyAdmin

root@server:~# cd /var/www/html

root@test:/var/www/html# wget https://cumi.co/20190416/downloads/phpMyAdmin.zip

root@test:/var/www/html# unzip phpMyAdmin.zip

#http://IP_Address/phpMyAdmin/index.php

#APW Project - Golang

root@server:~# cd /var/www/html

root@test:/var/www/html# mkdir apw

root@test:/var/www/html# cd apw

root@test:/var/www/html/apw# wget https://cumi.co/20190416/downloads/apw.zip

root@test:/var/www/html/apw# unzip apw.zip

root@test:/var/www/html/apw# go get -v golang.org/x/net/websocket

root@test:/var/www/html/apw# go build

#http://IP_Address/phpMyAdmin/index.php

#建立資料庫:apw [utf8_bin]

#import apw.sql

#APW Project - Web

root@server:~# cd /var/www/html

root@test:/var/www/html# mkdir apw_web

root@test:/var/www/html# cd apw_web

root@test:/var/www/html/apw_web# wget https://cumi.co/20190416/downloads/apw_web.zip

root@test:/var/www/html/apw_web# unzip apw_web.zip

root@test:/var/www/html/apw_web# chmod -c 777 ./templates_c

#修改檔案:/var/www/html/apw_web/assets/ajax.js //修改裡面的IP和PORT

#http://IP_Address/apw_web
