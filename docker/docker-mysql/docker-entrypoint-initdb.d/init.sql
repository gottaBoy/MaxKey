create database if not exists  `Sophon` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */ ;

use Sophon ;

source /docker-entrypoint-initdb.d/latest/Sophon.sql   ;
 
