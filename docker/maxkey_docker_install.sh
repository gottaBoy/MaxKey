echo "network create "

docker network create sophon.console

mysql_version=8.4.2
#MySQL
docker pull mysql:$mysql_version
docker image tag mysql:$mysql_version sophon-edge/mysql

#sophon
docker pull sophon-edge/sophon:latest

#sophon-mgt
docker pull sophon-edge/sophon-mgt:latest

#sophon-frontend
docker pull sophon-edge/sophon-frontend:latest

#sophon-mgt-frontend
docker pull sophon-edge/sophon-mgt-frontend:latest

#sophon-nginx proxy
cd docker-nginx

docker build -f Dockerfile -t sophon-edge/sophon-nginx .

cd ..

echo "installed done."
