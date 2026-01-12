echo "start Sophon ... "
#MySQL
docker run -p 3306:3306   \
-v ./docker-mysql/data:/var/lib/mysql \
-v ./docker-mysql/logs:/var/log/mysql \
-v ./docker-mysql/conf.d:/etc/mysql/conf.d  \
-v ./docker-mysql/docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d  \
--name Sophon-mysql  \
--hostname Sophon-mysql \
--network Sophon.top \
-e MYSQL_ROOT_PASSWORD=Sophon  \
-d Sophontop/mysql:latest

#Sophon
docker 	run -p 9527:9527  \
-e DATABASE_HOST=Sophon-mysql \
-e DATABASE_PORT=3306 \
-e DATABASE_NAME=Sophon \
-e DATABASE_USER=root \
-e DATABASE_PWD=Sophon \
--name Sophon \
--hostname Sophon \
--network Sophon.top \
-d Sophontop/Sophon:latest 

#Sophon-mgt
docker 	run -p 9526:9526  \
-e DATABASE_HOST=Sophon-mysql \
-e DATABASE_PORT=3306 \
-e DATABASE_NAME=Sophon \
-e DATABASE_USER=root \
-e DATABASE_PWD=Sophon \
--name Sophon-mgt \
--hostname Sophon-mgt \
--network Sophon.top \
-d Sophontop/Sophon-mgt:latest 

#Sophon-frontend
docker 	run -p 8527:8527  \
--name Sophon-frontend \
--hostname Sophon-frontend \
--network Sophon.top \
-d Sophontop/Sophon-frontend:latest 

#Sophon-mgt-frontend
docker 	run -p 8526:8526  \
--name Sophon-mgt-frontend \
--hostname Sophon-mgt-frontend \
--network Sophon.top \
-d Sophontop/Sophon-mgt-frontend:latest 

#Sophon-nginx proxy
docker 	run -p 80:80  \
--name Sophon-nginx \
--hostname Sophon-nginx \
--network Sophon.top \
-d Sophontop/Sophon-nginx 

docker ps -a

echo "started done."
