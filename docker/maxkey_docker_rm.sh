echo "rm Sophon ... "

./Sophon_docker_stop.sh

#Sophon-nginx proxy
docker rm Sophon-nginx

#Sophon-frontend
docker rm Sophon-frontend

#Sophon-mgt-frontend
docker rm Sophon-mgt-frontend

#Sophon
docker rm Sophon  

#Sophon-mgt
docker rm Sophon-mgt  

#MySQL
docker rm Sophon-mysql  

echo "rm done."
