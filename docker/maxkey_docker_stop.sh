echo "stop Sophon ... "

#Sophon-nginx proxy
docker stop Sophon-nginx

#Sophon-frontend
docker stop Sophon-frontend

#Sophon-mgt-frontend
docker stop Sophon-mgt-frontend

#Sophon
docker stop Sophon  

#Sophon-mgt
docker stop Sophon-mgt  

#MySQL
docker stop Sophon-mysql  

echo "stoped done."
