echo "clear REPOSITORY IMAGE sophon ... "

#sophon-nginx proxy
docker rmi sophon-edge/sophon-nginx

#sophon-frontend
docker rmi sophon-edge/sophon-frontend

#sophon-mgt-frontend
docker rmi sophon-edge/sophon-mgt-frontend

#sophon
docker rmi sophon-edge/sophon  

#sophon-mgt
docker rmi sophon-edge/sophon-mgt  

#MySQL
docker rmi sophon-edge/mysql  

echo "clear REPOSITORY IMAGE done."
