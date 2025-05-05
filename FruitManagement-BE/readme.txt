How to run backend source code in local 

1/ Docker: 
- Gõ dòng sau vào terminal sau khi đã cài Docker:
docker pull mysql
docker run --name manach -e MYSQL_ROOT_PASSWORD=1234 -d -p 3307:3306 mysql

2/ Cài TablePlus, tạo ra connection mới: 
{
  name: db_manach
  Host: localhost
  Port: 3307
  user: root
  password: 1234
}
-> Connect

3/ create new database name: db_manach

4/ import the sql file in discord: db_manach.sql

5/ clone the backend source code:
git clone https://github.com/dbn-minh/FruitManagement-BE.git
cd FruitManagement-BE
git switch master
yarn

6/ Run using: 
yarn start

7/ Download PostMan to test API
-> Text Minh Doan the email to be invited to the collaboration,
 which have all the APIs listed for you to test