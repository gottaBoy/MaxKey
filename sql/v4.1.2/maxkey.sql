-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: Sophon
-- ------------------------------------------------------
-- Server version	8.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ze_access`
--

DROP TABLE IF EXISTS `ze_access`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_access` (
  `ID` varchar(45) NOT NULL COMMENT 'ID',
  `GROUPID` varchar(45) NOT NULL COMMENT 'GROUPID',
  `APPID` varchar(45) NOT NULL COMMENT 'APPID',
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `INSTID` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `GROUPID_APPID` (`GROUPID`,`APPID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_accounts`
--

DROP TABLE IF EXISTS `ze_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_accounts` (
  `ID` varchar(45) NOT NULL COMMENT '涓婚敭',
  `USERID` varchar(45) DEFAULT NULL COMMENT '鐢ㄦ埛ID',
  `USERNAME` varchar(45) DEFAULT NULL COMMENT '鐢ㄦ埛鍚?,
  `DISPLAYNAME` varchar(45) DEFAULT NULL COMMENT '鐢ㄦ埛鏄剧ず鍚?,
  `strategyName` varchar(200) DEFAULT NULL,
  `STRATEGYID` varchar(45) DEFAULT NULL,
  `APPID` varchar(45) DEFAULT NULL COMMENT '搴旂敤ID',
  `APPNAME` varchar(100) DEFAULT NULL COMMENT '搴旂敤鍚嶇О',
  `RELATEDUSERNAME` varchar(200) DEFAULT NULL COMMENT '鐢ㄦ埛鍚?,
  `RELATEDPASSWORD` varchar(500) DEFAULT NULL COMMENT '瀵嗙爜',
  `CREATETYPE` varchar(45) DEFAULT 'automatic',
  `STATUS` int DEFAULT NULL,
  `CREATEDBY` varchar(45) DEFAULT NULL,
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `MODIFIEDBY` varchar(45) DEFAULT NULL,
  `MODIFIEDDATE` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '淇敼鏃堕棿',
  `INSTID` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UNIQUE_USER_ACCOUNT` (`USERNAME`,`APPID`,`RELATEDUSERNAME`,`USERID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='鐢ㄦ埛璐﹀彿琛?;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_apps`
--

DROP TABLE IF EXISTS `ze_apps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_apps` (
  `ID` varchar(45) NOT NULL COMMENT '涓婚敭',
  `APPNAME` varchar(300) NOT NULL COMMENT '搴旂敤鍚嶇О',
  `LOGINURL` varchar(300) CHARACTER SET cp850 COLLATE cp850_general_ci NOT NULL COMMENT '搴旂敤鐧诲綍鍦板潃',
  `CATEGORY` varchar(45) DEFAULT NULL COMMENT '搴旂敤绫诲瀷',
  `SECRET` varchar(500) DEFAULT NULL COMMENT '搴旂敤瀵嗛挜',
  `PROTOCOL` varchar(300) DEFAULT NULL COMMENT '鍗曠偣鐧诲綍鍗忚',
  `ICON` longblob COMMENT '搴旂敤鍥炬爣',
  `STATUS` tinyint unsigned DEFAULT NULL COMMENT '鐘舵€?,
  `CREATEDBY` varchar(45) DEFAULT NULL COMMENT '鍒涘缓浜?,
  `CREATEDDATE` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '鍒涘缓鏃堕棿',
  `MODIFIEDBY` varchar(45) DEFAULT NULL COMMENT '淇敼浜?,
  `MODIFIEDDATE` datetime DEFAULT NULL COMMENT '淇敼鏃堕棿',
  `DESCRIPTION` varchar(400) DEFAULT NULL COMMENT '鎻忚堪',
  `VENDOR` varchar(45) DEFAULT NULL COMMENT '渚涘簲鍟?,
  `VENDORURL` varchar(200) DEFAULT NULL COMMENT '渚涘簲鍟嗗湴鍧€',
  `CREDENTIAL` varchar(45) DEFAULT 'none' COMMENT '鍗曠偣鐧诲綍鍑瘉绫诲瀷',
  `SHAREDUSERNAME` varchar(100) DEFAULT NULL COMMENT '鍏变韩鐢ㄦ埛鍚?,
  `SHAREDPASSWORD` varchar(500) DEFAULT NULL COMMENT '鍏变韩瀵嗙爜',
  `SYSTEMUSERATTR` varchar(45) DEFAULT NULL COMMENT '绯荤粺鐢ㄦ埛灞炴€?,
  `ISEXTENDATTR` varchar(4) DEFAULT NULL COMMENT '鏄惁鏀寔搴旂敤鎵╁睍灞炴€?,
  `EXTENDATTR` varchar(4000) DEFAULT NULL COMMENT '搴旂敤鎵╁睍灞炴€?,
  `SORTINDEX` int unsigned DEFAULT '0' COMMENT '鎺掑簭搴忓彿',
  `ISSIGNATURE` tinyint DEFAULT '0' COMMENT '绛惧悕鐘舵€?,
  `VISIBLE` tinyint DEFAULT '0' COMMENT '鍙鏍囪瘑',
  `ISADAPTER` tinyint unsigned DEFAULT '0' COMMENT '鏄惁鏀寔閫傞厤鍣?,
  `ADAPTERID` varchar(45) DEFAULT NULL,
  `ADAPTERNAME` varchar(100) DEFAULT NULL,
  `ADAPTER` varchar(500) DEFAULT NULL COMMENT '閫傞厤鍣?,
  `PRINCIPAL` varchar(45) DEFAULT NULL COMMENT '鎺ュ彛API鐢ㄦ埛',
  `CREDENTIALS` varchar(500) DEFAULT NULL COMMENT '鎺ュ彛API鐢ㄦ埛鍑瘉',
  `USERPROPERTYS` varchar(4000) DEFAULT NULL COMMENT '鎺ュ彛杩斿洖鐢ㄦ埛灞炴€у畾涔?,
  `INDUCER` varchar(50) DEFAULT 'IDP' COMMENT '寮曞鏂瑰紡',
  `LOGOUTURL` varchar(300) DEFAULT NULL COMMENT '娉ㄩ攢鍦板潃',
  `LOGOUTTYPE` int DEFAULT NULL COMMENT '鍗曠偣娉ㄩ攢鏂瑰紡 0 NONE,1 BACK_CHANNEL,2 FRONT_CHANNEL',
  `INSTID` varchar(45) NOT NULL,
  `FREQUENTLY` varchar(45) DEFAULT 'no',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='搴旂敤琛?;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_apps_adapters`
--

DROP TABLE IF EXISTS `ze_apps_adapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_apps_adapters` (
  `ID` varchar(50) NOT NULL,
  `NAME` varchar(100) DEFAULT NULL,
  `PROTOCOL` varchar(300) DEFAULT NULL,
  `ADAPTER` varchar(500) DEFAULT NULL,
  `SORTINDEX` int DEFAULT NULL,
  `CREATEDBY` varchar(45) DEFAULT NULL,
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `MODIFIEDBY` varchar(45) DEFAULT NULL,
  `MODIFIEDDATE` datetime DEFAULT NULL,
  `DESCRIPTION` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='ADAPTER';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_apps_cas_details`
--

DROP TABLE IF EXISTS `ze_apps_cas_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_apps_cas_details` (
  `ID` varchar(45) NOT NULL,
  `SERVICE` varchar(400) NOT NULL,
  `CALLBACKURL` varchar(400) NOT NULL,
  `EXPIRES` int DEFAULT NULL,
  `INSTID` varchar(45) NOT NULL,
  `CASUSER` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_apps_form_based_details`
--

DROP TABLE IF EXISTS `ze_apps_form_based_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_apps_form_based_details` (
  `ID` varchar(45) NOT NULL COMMENT 'ID',
  `USERNAMEMAPPING` varchar(45) DEFAULT NULL COMMENT 'FORM LOGIN NAME',
  `PASSWORDMAPPING` varchar(45) DEFAULT NULL COMMENT 'FORM LOGIN PASSWORD',
  `REDIRECTURI` varchar(400) DEFAULT NULL COMMENT 'REDIRECTURI',
  `AUTHORIZEVIEW` varchar(100) DEFAULT NULL COMMENT 'AUTHORIZEVIEW FOR LOCAL VIEW DEAL',
  `passwordalgorithm` varchar(45) DEFAULT NULL,
  `INSTID` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='FormBase details';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_apps_jwt_details`
--

DROP TABLE IF EXISTS `ze_apps_jwt_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_apps_jwt_details` (
  `ID` varchar(45) NOT NULL COMMENT 'ID',
  `issuer` varchar(200) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `audience` varchar(200) DEFAULT NULL,
  `ALGORITHMKEY` text NOT NULL COMMENT '绉橀挜',
  `ALGORITHM` varchar(45) NOT NULL COMMENT '鍔犲瘑绠楁硶',
  `EncryptionMethod` varchar(45) DEFAULT NULL,
  `Signature` varchar(45) DEFAULT NULL COMMENT '绛惧悕绠楁硶',
  `Signaturekey` text COMMENT '绛惧悕瀵嗛挜',
  `EXPIRES` int unsigned DEFAULT '0' COMMENT 'EXPIRES TIME',
  `REDIRECTURI` varchar(400) NOT NULL COMMENT 'REDIRECTURI',
  `JWTNAME` varchar(45) DEFAULT NULL,
  `tokenType` varchar(20) DEFAULT NULL,
  `INSTID` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_apps_oauth_client_details`
--

DROP TABLE IF EXISTS `ze_apps_oauth_client_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_apps_oauth_client_details` (
  `CLIENT_ID` varchar(45) NOT NULL COMMENT 'appkey',
  `RESOURCE_IDS` varchar(256) DEFAULT NULL COMMENT '璧勬簮ids',
  `CLIENT_SECRET` varchar(500) DEFAULT NULL COMMENT 'appsecret',
  `SCOPE` varchar(256) DEFAULT NULL COMMENT 'SCOPE',
  `AUTHORIZED_GRANT_TYPES` varchar(256) DEFAULT NULL COMMENT '鎺堟潈绫诲瀷',
  `WEB_SERVER_REDIRECT_URI` varchar(512) DEFAULT NULL COMMENT 'REDIRECT_URI璁よ瘉杩斿洖鍦板潃',
  `AUTHORITIES` varchar(256) DEFAULT NULL COMMENT 'AUTHORITIES',
  `ACCESS_TOKEN_VALIDITY` int unsigned DEFAULT NULL COMMENT 'accesstoken鏈夋晥鏃堕棿',
  `REFRESH_TOKEN_VALIDITY` int unsigned DEFAULT NULL,
  `ADDITIONAL_INFORMATION` varchar(4096) DEFAULT NULL,
  `APPROVALPROMPT` varchar(45) DEFAULT 'force',
  `AUTOAPPROVE` varchar(256) DEFAULT NULL COMMENT '鑷姩閫氳繃',
  `PKCE` varchar(45) DEFAULT NULL,
  `PROTOCOL` varchar(45) DEFAULT NULL,
  `INSTID` varchar(45) NOT NULL,
  `issuer` varchar(200) DEFAULT NULL,
  `audience` varchar(200) DEFAULT NULL,
  `ALGORITHMKEY` text,
  `ALGORITHM` varchar(45) DEFAULT NULL,
  `EncryptionMethod` varchar(45) DEFAULT NULL,
  `Signature` varchar(45) DEFAULT NULL,
  `Signaturekey` text,
  `UserInfoResponse` varchar(45) DEFAULT 'Normal' COMMENT 'normal,signing,encryption, If both signing and encryption are performed, it MUST be signed then encrypted',
  `subject` varchar(45) DEFAULT 'username',
  PRIMARY KEY (`CLIENT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='oauth_client_details';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_apps_saml_v20_details`
--

DROP TABLE IF EXISTS `ze_apps_saml_v20_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_apps_saml_v20_details` (
  `ID` varchar(45) NOT NULL,
  `CERTISSUER` varchar(200) DEFAULT NULL,
  `CERTSUBJECT` varchar(200) DEFAULT NULL,
  `CERTEXPIRATION` varchar(100) DEFAULT NULL,
  `KEYSTORE` blob,
  `SPACSURL` varchar(200) NOT NULL,
  `ISSUER` varchar(300) DEFAULT NULL,
  `ENTITYID` varchar(300) DEFAULT NULL,
  `VALIDITYINTERVAL` int unsigned DEFAULT NULL,
  `NAMEIDFORMAT` varchar(45) DEFAULT NULL,
  `NAMEIDCONVERT` varchar(45) DEFAULT NULL,
  `NAMEIDSUFFIX` varchar(150) DEFAULT NULL,
  `AUDIENCE` varchar(300) DEFAULT NULL,
  `ENCRYPTED` varchar(45) DEFAULT NULL,
  `BINDING` varchar(45) DEFAULT NULL,
  `SIGNATURE` varchar(45) DEFAULT NULL,
  `DIGESTMETHOD` varchar(45) DEFAULT NULL,
  `METAURL` varchar(500) DEFAULT NULL,
  `INSTID` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_apps_token_based_details`
--

DROP TABLE IF EXISTS `ze_apps_token_based_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_apps_token_based_details` (
  `ID` varchar(45) NOT NULL COMMENT 'ID',
  `ALGORITHMKEY` varchar(500) NOT NULL COMMENT '绉橀挜',
  `ALGORITHM` varchar(45) NOT NULL COMMENT '鍔犲瘑绠楁硶 /DES,DESede,Blowfish and AES',
  `EXPIRES` int unsigned DEFAULT '0' COMMENT 'EXPIRES TIME',
  `REDIRECTURI` varchar(400) NOT NULL COMMENT 'REDIRECTURI',
  `COOKIENAME` varchar(45) DEFAULT NULL,
  `tokenType` varchar(20) DEFAULT NULL,
  `INSTID` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_cnf_email_senders`
--

DROP TABLE IF EXISTS `ze_cnf_email_senders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_cnf_email_senders` (
  `id` varchar(50) NOT NULL,
  `smtpHost` varchar(45) DEFAULT NULL,
  `port` int DEFAULT NULL,
  `account` varchar(45) DEFAULT NULL,
  `credentials` varchar(500) DEFAULT NULL,
  `sslswitch` int DEFAULT NULL,
  `sender` varchar(45) DEFAULT NULL,
  `protocol` varchar(45) DEFAULT NULL,
  `encoding` varchar(45) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `instId` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `createdBy` varchar(45) DEFAULT NULL,
  `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(45) DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_cnf_ldap_context`
--

DROP TABLE IF EXISTS `ze_cnf_ldap_context`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_cnf_ldap_context` (
  `id` varchar(50) NOT NULL,
  `product` varchar(45) DEFAULT NULL,
  `sslswitch` varchar(45) DEFAULT NULL,
  `providerurl` varchar(200) DEFAULT NULL,
  `principal` varchar(100) DEFAULT NULL,
  `credentials` varchar(500) DEFAULT NULL,
  `basedn` varchar(500) DEFAULT NULL,
  `filters` varchar(500) DEFAULT NULL,
  `truststore` varchar(500) DEFAULT NULL,
  `truststorepassword` varchar(100) DEFAULT NULL,
  `msadDomain` varchar(100) DEFAULT NULL,
  `accountMapping` varchar(45) DEFAULT 'YES',
  `STATUS` int DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `instId` varchar(45) DEFAULT NULL,
  `CREATEDBY` varchar(45) DEFAULT NULL,
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `MODIFIEDBY` varchar(45) DEFAULT NULL,
  `MODIFIEDDATE` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_cnf_password_policy`
--

DROP TABLE IF EXISTS `ze_cnf_password_policy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_cnf_password_policy` (
  `ID` varchar(45) NOT NULL,
  `MINLENGTH` tinyint unsigned DEFAULT '0' COMMENT 'MINLENGTH',
  `MAXLENGTH` tinyint unsigned DEFAULT '0' COMMENT 'MAXLENGTH',
  `LOWERCASE` tinyint unsigned DEFAULT '0' COMMENT 'LOWERCASE',
  `UPPERCASE` tinyint unsigned DEFAULT '0' COMMENT 'UPPERCASE',
  `DIGITS` tinyint unsigned DEFAULT '0' COMMENT 'DIGITS',
  `SPECIALCHAR` tinyint unsigned DEFAULT '0' COMMENT 'SPECIALCHAR',
  `ATTEMPTS` tinyint unsigned DEFAULT '0' COMMENT 'ATTEMPTS LOGIN FOR LOCK',
  `DURATION` tinyint unsigned DEFAULT '0' COMMENT 'DURATION ',
  `EXPIRATION` tinyint unsigned DEFAULT '0' COMMENT 'PASSWORD EXPIRATION',
  `USERNAME` tinyint unsigned DEFAULT '0' COMMENT 'USERNAME IN PASSWORD',
  `HISTORY` tinyint DEFAULT '0' COMMENT 'SIMPLEPASSWORDS NOT USE FOR PASSWORD',
  `DICTIONARY` tinyint DEFAULT NULL,
  `ALPHABETICAL` tinyint DEFAULT NULL,
  `NUMERICAL` tinyint DEFAULT NULL,
  `QWERTY` tinyint DEFAULT NULL,
  `OCCURANCES` tinyint DEFAULT NULL,
  `CREATEDBY` varchar(45) DEFAULT NULL COMMENT 'CREATEDBY',
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'CREATEDDATE',
  `MODIFIEDBY` varchar(45) DEFAULT NULL COMMENT 'MODIFIEDBY',
  `MODIFIEDDATE` datetime DEFAULT NULL COMMENT 'MODIFIEDDATE',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='password policy';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_cnf_sms_provider`
--

DROP TABLE IF EXISTS `ze_cnf_sms_provider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_cnf_sms_provider` (
  `id` varchar(50) NOT NULL,
  `provider` varchar(100) DEFAULT NULL,
  `message` varchar(500) DEFAULT NULL,
  `appkey` varchar(100) DEFAULT NULL,
  `appsecret` varchar(500) DEFAULT NULL,
  `templateid` varchar(45) DEFAULT NULL,
  `signname` varchar(45) DEFAULT NULL,
  `smssdkappid` varchar(45) DEFAULT NULL COMMENT 'tencentcloud smssdkappid',
  `STATUS` int DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `instId` varchar(45) DEFAULT NULL,
  `CREATEDBY` varchar(45) DEFAULT NULL,
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `MODIFIEDBY` varchar(45) DEFAULT NULL,
  `MODIFIEDDATE` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_connectors`
--

DROP TABLE IF EXISTS `ze_connectors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_connectors` (
  `id` varchar(50) NOT NULL,
  `connname` varchar(200) DEFAULT NULL,
  `JUSTINTIME` tinyint DEFAULT NULL,
  `scheduler` varchar(45) DEFAULT NULL,
  `providerurl` varchar(400) DEFAULT NULL,
  `principal` varchar(200) DEFAULT NULL,
  `credentials` varchar(500) DEFAULT NULL,
  `filters` varchar(400) DEFAULT NULL,
  `STATUS` varchar(45) DEFAULT NULL,
  `CREATEDBY` varchar(45) DEFAULT NULL,
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `MODIFIEDBY` varchar(45) DEFAULT NULL,
  `MODIFIEDDATE` datetime DEFAULT NULL,
  `DESCRIPTION` varchar(45) DEFAULT NULL,
  `INSTID` varchar(45) NOT NULL,
  `APPID` varchar(45) DEFAULT NULL,
  `APPNAME` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='杩炴帴鍣?;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_file_upload`
--

DROP TABLE IF EXISTS `ze_file_upload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_file_upload` (
  `id` varchar(100) NOT NULL,
  `FileName` varchar(400) DEFAULT NULL,
  `uploaded` longblob NOT NULL,
  `ContentSize` int DEFAULT NULL,
  `ContentType` varchar(100) DEFAULT NULL,
  `createdBy` varchar(45) DEFAULT NULL,
  `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_group_member`
--

DROP TABLE IF EXISTS `ze_group_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_group_member` (
  `ID` varchar(100) NOT NULL DEFAULT '' COMMENT 'ID',
  `GROUPID` varchar(100) NOT NULL COMMENT 'GROUPID',
  `MEMBERID` varchar(100) NOT NULL COMMENT 'MEMBERID USERID OR GROUP ID',
  `TYPE` varchar(45) NOT NULL COMMENT 'TYPE  USER OR GROUP',
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `INSTID` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `GROUPID_MEMBERID` (`GROUPID`,`MEMBERID`,`TYPE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_groups`
--

DROP TABLE IF EXISTS `ze_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_groups` (
  `ID` varchar(45) NOT NULL COMMENT 'ID',
  `GROUPCODE` varchar(45) DEFAULT NULL,
  `GROUPNAME` varchar(100) DEFAULT NULL COMMENT 'GROUP NAME',
  `category` varchar(20) DEFAULT NULL COMMENT '鍔ㄦ€佺敤鎴风粍锛宒ynamic鍔ㄦ€佺粍 static闈欐€佺粍app搴旂敤璐﹀彿缁?,
  `FILTERS` text COMMENT '杩囨护鏉′欢SQL',
  `ORGIDSLIST` text COMMENT '鏈烘瀯鍒楄〃',
  `RESUMETIME` varchar(45) DEFAULT NULL COMMENT 'RESUMETIME',
  `SUSPENDTIME` varchar(45) DEFAULT NULL COMMENT 'SUSPENDTIME',
  `STATUS` tinyint unsigned DEFAULT NULL COMMENT 'STATUS',
  `CREATEDBY` varchar(45) DEFAULT NULL COMMENT 'CREATEDBY',
  `ISDEFAULT` tinyint unsigned DEFAULT NULL COMMENT 'ISDEFAULT',
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'CREATEDDATE',
  `MODIFIEDBY` varchar(45) DEFAULT NULL COMMENT 'MODIFIEDBY',
  `MODIFIEDDATE` datetime DEFAULT NULL COMMENT 'MODIFIEDDATE',
  `DESCRIPTION` varchar(500) DEFAULT NULL COMMENT 'DESCRIPTION',
  `INSTID` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_history_connector`
--

DROP TABLE IF EXISTS `ze_history_connector`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_history_connector` (
  `ID` varchar(45) NOT NULL,
  `CONNAME` varchar(200) DEFAULT NULL,
  `SOURCEID` varchar(45) DEFAULT NULL,
  `SOURCENAME` varchar(500) DEFAULT NULL,
  `OBJECTID` varchar(45) DEFAULT NULL,
  `OBJECTNAME` varchar(500) DEFAULT NULL,
  `DESCRIPTION` varchar(1000) DEFAULT NULL,
  `SYNCTIME` datetime DEFAULT CURRENT_TIMESTAMP,
  `RESULT` varchar(45) DEFAULT NULL,
  `INSTID` varchar(45) NOT NULL,
  `TOPIC` varchar(45) DEFAULT NULL,
  `ACTIONTYPE` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_history_event`
--

DROP TABLE IF EXISTS `ze_history_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_history_event` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `eventname` varchar(45) DEFAULT NULL,
  `datatype` varchar(45) DEFAULT NULL,
  `datacount` int DEFAULT NULL,
  `executedatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `INSTID` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_history_login`
--

DROP TABLE IF EXISTS `ze_history_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_history_login` (
  `ID` varchar(45) NOT NULL COMMENT 'ID',
  `SESSIONID` varchar(45) DEFAULT NULL COMMENT 'SESSIONID',
  `USERID` varchar(45) NOT NULL COMMENT 'USERID',
  `USERNAME` varchar(200) NOT NULL COMMENT 'USERNAME',
  `DISPLAYNAME` varchar(45) DEFAULT NULL COMMENT 'DISPLAYNAME',
  `MESSAGE` varchar(200) DEFAULT NULL COMMENT 'MESSAGE',
  `SOURCEIP` varchar(300) DEFAULT NULL COMMENT 'LOGIN SOURCEIP ',
  `country` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `location` varchar(500) DEFAULT NULL,
  `LOGINTYPE` varchar(45) DEFAULT NULL COMMENT 'LOGINTYPE',
  `CODE` varchar(45) DEFAULT NULL COMMENT 'CODE',
  `PROVIDER` varchar(45) DEFAULT NULL COMMENT 'PROVIDER',
  `BROWSER` varchar(45) DEFAULT NULL COMMENT 'BROWSER',
  `PLATFORM` varchar(45) DEFAULT NULL COMMENT 'PLATFORM',
  `APPLICATION` varchar(45) DEFAULT NULL COMMENT 'APPLICATION',
  `LOGINURL` varchar(450) DEFAULT NULL COMMENT 'LOGINURL',
  `LOGINTIME` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'LOGINTIME',
  `LOGOUTTIME` datetime NOT NULL DEFAULT '1970-01-01 00:00:00' COMMENT 'LOGOUTTIME',
  `SESSIONSTATUS` int DEFAULT '1',
  `INSTID` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='history_login';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_history_login_apps`
--

DROP TABLE IF EXISTS `ze_history_login_apps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_history_login_apps` (
  `ID` varchar(45) NOT NULL COMMENT 'ID',
  `SESSIONID` varchar(45) DEFAULT NULL COMMENT 'SESSIONID',
  `LOGINTIME` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'LOGINTIME',
  `APPID` varchar(45) NOT NULL COMMENT 'ACCESS APPID',
  `APPNAME` varchar(45) DEFAULT NULL COMMENT 'APPNAME',
  `USERID` varchar(45) DEFAULT NULL COMMENT 'USERID',
  `USERNAME` varchar(45) DEFAULT NULL COMMENT 'USERNAME',
  `DISPLAYNAME` varchar(45) DEFAULT NULL COMMENT 'DISPLAYNAME',
  `INSTID` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='Sign On apps Records';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_history_provisions`
--

DROP TABLE IF EXISTS `ze_history_provisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_history_provisions` (
  `ID` varchar(50) NOT NULL,
  `topic` varchar(45) DEFAULT NULL,
  `actionType` varchar(45) DEFAULT NULL,
  `content` longtext,
  `sendTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `connected` tinyint DEFAULT NULL,
  `instId` int DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_history_synchronizer`
--

DROP TABLE IF EXISTS `ze_history_synchronizer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_history_synchronizer` (
  `ID` varchar(45) NOT NULL COMMENT 'ID',
  `SYNCID` varchar(45) NOT NULL COMMENT 'SYNCID',
  `SYNCNAME` varchar(45) DEFAULT NULL COMMENT 'SYNCNAME',
  `OBJECTID` varchar(45) DEFAULT NULL COMMENT 'OBJECTID',
  `OBJECTNAME` varchar(45) DEFAULT NULL COMMENT 'OBJECTNAME',
  `OBJECTTYPE` varchar(45) DEFAULT NULL COMMENT 'OBJECTTYPE',
  `SYNCTIME` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'SYNCTIME',
  `RESULT` varchar(45) DEFAULT NULL,
  `INSTID` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='synchronizer logs';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_history_system_logs`
--

DROP TABLE IF EXISTS `ze_history_system_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_history_system_logs` (
  `ID` varchar(45) NOT NULL COMMENT 'ID',
  `TOPIC` varchar(100) DEFAULT NULL COMMENT 'SERVICENAME',
  `MESSAGE` varchar(200) DEFAULT NULL COMMENT 'MESSAGE',
  `MESSAGEACTION` varchar(45) DEFAULT NULL COMMENT 'OPERATETYPE',
  `MESSAGERESULT` varchar(45) DEFAULT NULL COMMENT 'MESSAGETYPE',
  `USERID` varchar(45) DEFAULT NULL COMMENT 'TID',
  `USERNAME` varchar(45) DEFAULT NULL COMMENT 'USERNAME',
  `DISPLAYNAME` varchar(45) DEFAULT NULL COMMENT 'CODE',
  `EXECUTETIME` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'CREATEDDATE',
  `INSTID` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='USER OPERATE LOGS';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_institutions`
--

DROP TABLE IF EXISTS `ze_institutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_institutions` (
  `ID` varchar(45) NOT NULL,
  `NAME` varchar(200) NOT NULL,
  `FULLNAME` varchar(100) DEFAULT NULL,
  `DIVISION` varchar(45) DEFAULT NULL,
  `COUNTRY` varchar(45) DEFAULT NULL,
  `REGION` varchar(45) DEFAULT NULL,
  `LOCALITY` varchar(45) DEFAULT NULL,
  `STREET` varchar(45) DEFAULT NULL,
  `CONTACT` varchar(45) DEFAULT NULL,
  `ADDRESS` varchar(200) DEFAULT NULL,
  `POSTALCODE` varchar(45) DEFAULT NULL,
  `PHONE` varchar(200) DEFAULT NULL,
  `FAX` varchar(200) DEFAULT NULL,
  `EMAIL` varchar(45) DEFAULT NULL,
  `SORTINDEX` int unsigned DEFAULT '0',
  `LOGO` varchar(500) DEFAULT NULL,
  `DOMAIN` varchar(200) DEFAULT NULL,
  `frontTitle` varchar(200) DEFAULT NULL,
  `CONSOLEDOMAIN` varchar(45) DEFAULT NULL,
  `CONSOLETITLE` varchar(200) DEFAULT NULL,
  `captcha` varchar(45) DEFAULT 'NONE,TEXT,ARITHMETIC',
  `defaultUri` varchar(200) DEFAULT NULL,
  `STATUS` tinyint DEFAULT NULL,
  `DESCRIPTION` varchar(200) DEFAULT NULL,
  `INSTID` varchar(45) DEFAULT NULL,
  `CREATEDBY` varchar(45) DEFAULT NULL,
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `MODIFIEDBY` varchar(45) DEFAULT NULL,
  `MODIFIEDDATE` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `DOMAIN_UNIQUE` (`DOMAIN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='institutions鏈烘瀯琛紝瀛樻斁绉熸埛淇℃伅multi-tenancy';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_localization`
--

DROP TABLE IF EXISTS `ze_localization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_localization` (
  `id` varchar(45) NOT NULL,
  `property` varchar(200) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `langZh` varchar(500) DEFAULT NULL,
  `langEn` varchar(500) DEFAULT NULL,
  `instId` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_organizations`
--

DROP TABLE IF EXISTS `ze_organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_organizations` (
  `ID` varchar(45) NOT NULL,
  `ORGCODE` varchar(45) DEFAULT NULL,
  `ORGNAME` varchar(200) NOT NULL,
  `FULLNAME` varchar(100) DEFAULT NULL,
  `TYPE` varchar(45) DEFAULT NULL,
  `LEVEL` int unsigned DEFAULT NULL,
  `PARENTID` varchar(45) DEFAULT NULL,
  `PARENTCODE` varchar(45) DEFAULT NULL,
  `PARENTNAME` varchar(45) DEFAULT NULL,
  `CODEPATH` varchar(500) DEFAULT NULL,
  `NAMEPATH` varchar(400) DEFAULT NULL,
  `DESCRIPTION` varchar(200) DEFAULT NULL,
  `STATUS` tinyint unsigned DEFAULT NULL,
  `CREATEDBY` varchar(45) DEFAULT NULL,
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `MODIFIEDBY` varchar(45) DEFAULT NULL,
  `MODIFIEDDATE` datetime DEFAULT NULL,
  `ADDRESS` varchar(200) DEFAULT NULL,
  `POSTALCODE` varchar(45) DEFAULT NULL,
  `PHONE` varchar(200) DEFAULT NULL,
  `FAX` varchar(200) DEFAULT NULL,
  `SORTINDEX` int unsigned DEFAULT '0',
  `DIVISION` varchar(45) DEFAULT NULL,
  `COUNTRY` varchar(45) DEFAULT NULL,
  `REGION` varchar(45) DEFAULT NULL,
  `LOCALITY` varchar(45) DEFAULT NULL,
  `STREET` varchar(45) DEFAULT NULL,
  `HASCHILD` varchar(45) DEFAULT NULL,
  `CONTACT` varchar(45) DEFAULT NULL,
  `EMAIL` varchar(45) DEFAULT NULL,
  `LDAPDN` varchar(1000) DEFAULT NULL,
  `INSTID` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_organizations_cast`
--

DROP TABLE IF EXISTS `ze_organizations_cast`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_organizations_cast` (
  `ID` varchar(45) NOT NULL COMMENT 'ID',
  `CODE` varchar(45) DEFAULT NULL COMMENT '鏈烘瀯缂栫爜',
  `NAME` varchar(200) NOT NULL COMMENT '鏈烘瀯鍚嶇О',
  `FULLNAME` varchar(100) DEFAULT NULL,
  `PARENTID` varchar(45) DEFAULT NULL COMMENT '鐖剁骇ID',
  `PARENTNAME` varchar(45) DEFAULT NULL COMMENT '鐖剁骇鍚嶇О',
  `CODEPATH` varchar(500) DEFAULT NULL COMMENT 'CODE璺緞',
  `NAMEPATH` varchar(400) DEFAULT NULL COMMENT '鍚嶇О璺緞',
  `SORTINDEX` int DEFAULT NULL,
  `STATUS` tinyint unsigned DEFAULT NULL,
  `PROVIDER` varchar(45) DEFAULT NULL COMMENT '鏈烘瀯鎻愪緵鑰?,
  `ORGID` varchar(45) DEFAULT NULL COMMENT 'MXK鏈烘瀯id',
  `ORGPARENTID` varchar(45) DEFAULT NULL COMMENT 'MXK鏈烘瀯PARENTID',
  `INSTID` varchar(45) NOT NULL,
  `CREATEDBY` varchar(45) DEFAULT NULL COMMENT 'CREATEDBY',
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'CREATEDDATE',
  `MODIFIEDBY` varchar(45) DEFAULT NULL COMMENT 'MODIFIEDBY',
  `MODIFIEDDATE` datetime DEFAULT NULL COMMENT 'MODIFIEDDATE',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='鏈烘瀯鏄犲皠琛?;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_permission`
--

DROP TABLE IF EXISTS `ze_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_permission` (
  `id` varchar(50) NOT NULL,
  `appid` varchar(50) DEFAULT NULL,
  `groupid` varchar(50) DEFAULT NULL,
  `resourceid` varchar(50) DEFAULT NULL,
  `CREATEDBY` varchar(45) DEFAULT NULL,
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` int DEFAULT '1',
  `INSTID` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_permission_role`
--

DROP TABLE IF EXISTS `ze_permission_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_permission_role` (
  `id` varchar(50) NOT NULL,
  `appid` varchar(50) DEFAULT NULL,
  `roleid` varchar(50) DEFAULT NULL,
  `resourceid` varchar(50) DEFAULT NULL,
  `CREATEDBY` varchar(45) DEFAULT NULL,
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` int DEFAULT '1',
  `INSTID` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_register`
--

DROP TABLE IF EXISTS `ze_register`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_register` (
  `id` varchar(50) NOT NULL,
  `displayName` varchar(200) DEFAULT NULL,
  `workEmail` varchar(100) DEFAULT NULL,
  `workPhone` varchar(50) DEFAULT NULL,
  `employees` int DEFAULT NULL,
  `instName` varchar(200) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `createdBy` varchar(50) DEFAULT NULL,
  `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `modifiedBy` varchar(50) DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_remember_me`
--

DROP TABLE IF EXISTS `ze_remember_me`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_remember_me` (
  `id` varchar(45) NOT NULL,
  `userid` varchar(45) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `lastLoginTime` varchar(45) DEFAULT NULL,
  `expirationTime` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_resources`
--

DROP TABLE IF EXISTS `ze_resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_resources` (
  `id` varchar(50) NOT NULL,
  `RESOURCENAME` varchar(200) DEFAULT NULL,
  `RESOURCETYPE` varchar(50) DEFAULT NULL,
  `RESOURCEURL` varchar(500) DEFAULT NULL,
  `permission` varchar(500) DEFAULT NULL,
  `STATUS` varchar(45) DEFAULT NULL,
  `DESCRIPTION` varchar(500) DEFAULT NULL,
  `CREATEDBY` varchar(45) DEFAULT NULL,
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `MODIFIEDBY` varchar(45) DEFAULT NULL,
  `MODIFIEDDATE` datetime DEFAULT NULL,
  `parentId` varchar(50) DEFAULT NULL,
  `parentname` varchar(200) DEFAULT NULL,
  `APPID` varchar(50) DEFAULT NULL,
  `RESOURCEACTION` varchar(200) DEFAULT NULL,
  `RESOURCEICON` varchar(100) DEFAULT NULL,
  `RESOURCESTYLE` varchar(500) DEFAULT NULL,
  `SORTINDEX` int DEFAULT NULL,
  `INSTID` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_role_member`
--

DROP TABLE IF EXISTS `ze_role_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_role_member` (
  `ID` varchar(100) NOT NULL DEFAULT '' COMMENT 'ID',
  `ROLEID` varchar(100) NOT NULL COMMENT 'GROUPID',
  `MEMBERID` varchar(100) NOT NULL COMMENT 'MEMBERID USERID OR GROUP ID',
  `TYPE` varchar(45) NOT NULL COMMENT 'TYPE  USER OR GROUP',
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `INSTID` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ROLEID_MEMBERID` (`ROLEID`,`MEMBERID`,`TYPE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='group member,USERS OR GROUPS';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_roles`
--

DROP TABLE IF EXISTS `ze_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_roles` (
  `ID` varchar(45) NOT NULL COMMENT 'ID',
  `ROLECODE` varchar(45) DEFAULT NULL,
  `ROLENAME` varchar(100) DEFAULT NULL COMMENT 'GROUP NAME',
  `category` varchar(20) DEFAULT NULL COMMENT '鍔ㄦ€佺敤鎴风粍锛宒ynamic鍔ㄦ€佺粍 static闈欐€佺粍app搴旂敤璐﹀彿缁?,
  `FILTERS` text COMMENT '杩囨护鏉′欢SQL',
  `ORGIDSLIST` text COMMENT '鏈烘瀯鍒楄〃',
  `RESUMETIME` varchar(45) DEFAULT NULL COMMENT 'RESUMETIME',
  `SUSPENDTIME` varchar(45) DEFAULT NULL COMMENT 'SUSPENDTIME',
  `STATUS` tinyint unsigned DEFAULT NULL COMMENT 'STATUS',
  `ISDEFAULT` tinyint unsigned DEFAULT NULL COMMENT 'ISDEFAULT',
  `CREATEDBY` varchar(45) DEFAULT NULL COMMENT 'CREATEDBY',
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'CREATEDDATE',
  `MODIFIEDBY` varchar(45) DEFAULT NULL COMMENT 'MODIFIEDBY',
  `MODIFIEDDATE` datetime DEFAULT NULL COMMENT 'MODIFIEDDATE',
  `DESCRIPTION` varchar(500) DEFAULT NULL COMMENT 'DESCRIPTION',
  `INSTID` varchar(45) NOT NULL,
  `APPID` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='groups';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_socials_associate`
--

DROP TABLE IF EXISTS `ze_socials_associate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_socials_associate` (
  `ID` varchar(45) NOT NULL,
  `USERID` varchar(45) NOT NULL COMMENT 'USERID',
  `USERNAME` varchar(45) NOT NULL,
  `PROVIDER` varchar(45) NOT NULL COMMENT 'PROVIDER',
  `SOCIALUSERINFO` text COMMENT 'SOCIALUSERINFO',
  `SOCIALUSERID` varchar(100) NOT NULL COMMENT 'SOCIALUSERID',
  `EXATTRIBUTE` text,
  `ACCESSTOKEN` text,
  `CREATEDDATE` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATEDDATE` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `TRANSMISSION` varchar(45) DEFAULT 'automatic',
  `INSTID` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='socialsignon USER BIND';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_socials_provider`
--

DROP TABLE IF EXISTS `ze_socials_provider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_socials_provider` (
  `ID` varchar(45) NOT NULL,
  `provider` varchar(45) DEFAULT NULL,
  `providername` varchar(45) DEFAULT NULL,
  `icon` varchar(45) DEFAULT NULL,
  `clientid` varchar(100) DEFAULT NULL,
  `clientsecret` varchar(500) DEFAULT NULL,
  `agentId` varchar(45) DEFAULT NULL,
  `display` varchar(45) DEFAULT 'false',
  `sortIndex` int DEFAULT '1',
  `scancode` varchar(45) DEFAULT 'none',
  `status` int DEFAULT '1',
  `CREATEDBY` varchar(45) DEFAULT NULL,
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `MODIFIEDBY` varchar(45) DEFAULT NULL,
  `MODIFIEDDATE` datetime DEFAULT NULL,
  `INSTID` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_synchro_related`
--

DROP TABLE IF EXISTS `ze_synchro_related`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_synchro_related` (
  `id` varchar(45) NOT NULL,
  `objectid` varchar(45) DEFAULT NULL,
  `objectname` varchar(200) DEFAULT NULL,
  `objectDisplayName` varchar(200) DEFAULT NULL,
  `objecttype` varchar(45) DEFAULT NULL,
  `syncId` varchar(100) DEFAULT NULL,
  `syncName` varchar(200) DEFAULT NULL,
  `originId` varchar(1000) DEFAULT NULL,
  `originId2` varchar(200) DEFAULT NULL,
  `originId3` varchar(200) DEFAULT NULL,
  `instId` varchar(45) DEFAULT NULL,
  `synctime` datetime DEFAULT CURRENT_TIMESTAMP,
  `originname` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_synchronizers`
--

DROP TABLE IF EXISTS `ze_synchronizers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_synchronizers` (
  `id` varchar(50) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `service` varchar(45) DEFAULT NULL,
  `sourcetype` varchar(45) DEFAULT NULL,
  `scheduler` varchar(45) DEFAULT NULL,
  `providerurl` varchar(400) DEFAULT NULL,
  `driverclass` varchar(400) DEFAULT NULL,
  `principal` varchar(200) DEFAULT NULL,
  `credentials` varchar(500) DEFAULT NULL,
  `RESUMETIME` varchar(45) DEFAULT NULL,
  `SUSPENDTIME` varchar(45) DEFAULT NULL,
  `userBasedn` varchar(200) DEFAULT NULL,
  `userfilters` varchar(4000) DEFAULT NULL,
  `orgBasedn` varchar(200) DEFAULT NULL,
  `orgFilters` varchar(4000) DEFAULT NULL,
  `msaddomain` varchar(45) DEFAULT NULL,
  `sslswitch` varchar(45) DEFAULT NULL,
  `truststore` varchar(45) DEFAULT NULL,
  `truststorepassword` varchar(45) DEFAULT NULL,
  `SYNCSTARTTIME` int DEFAULT '0' COMMENT '鍚屾鏃堕棿鑼冨洿锛堝崟浣嶅ぉ锛?,
  `STATUS` varchar(45) DEFAULT NULL,
  `CREATEDBY` varchar(45) DEFAULT NULL,
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP,
  `MODIFIEDBY` varchar(45) DEFAULT NULL,
  `MODIFIEDDATE` datetime DEFAULT NULL,
  `DESCRIPTION` varchar(45) DEFAULT NULL,
  `INSTID` varchar(45) NOT NULL,
  `APPID` varchar(45) DEFAULT NULL,
  `APPNAME` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='鍚屾鍣?;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ze_userinfo`
--

DROP TABLE IF EXISTS `ze_userinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ze_userinfo` (
  `ID` varchar(45) NOT NULL COMMENT '缂栧彿',
  `USERNAME` varchar(100) NOT NULL COMMENT '鐧诲綍鍚?,
  `PASSWORD` varchar(500) NOT NULL COMMENT '瀵嗙爜',
  `DECIPHERABLE` varchar(500) NOT NULL COMMENT 'DE瀵嗙爜',
  `AUTHNTYPE` tinyint unsigned DEFAULT '1' COMMENT '璁よ瘉绫诲瀷',
  `MOBILE` varchar(45) DEFAULT NULL COMMENT '鎵嬫満鍙风爜',
  `MOBILEVERIFIED` varchar(45) DEFAULT NULL COMMENT '鎵嬫満鍙烽獙璇?,
  `EMAIL` varchar(45) DEFAULT NULL COMMENT '閭',
  `EMAILVERIFIED` smallint unsigned DEFAULT NULL COMMENT '閭楠岃瘉',
  `DISPLAYNAME` varchar(45) DEFAULT NULL COMMENT '鏄剧ず鍚嶇О',
  `NICKNAME` varchar(45) DEFAULT NULL COMMENT '鏄电О',
  `PICTURE` longblob COMMENT '澶村儚',
  `TIMEZONE` varchar(45) DEFAULT 'Asia/Shanghai' COMMENT '鏃跺尯',
  `LOCALE` varchar(45) DEFAULT 'zh_CN' COMMENT '鍦板潃',
  `PREFERREDLANGUAGE` varchar(45) DEFAULT 'zh_CN' COMMENT '璇█鍋忓ソ',
  `PASSWORDQUESTION` varchar(45) DEFAULT NULL COMMENT '瀵嗙爜闂',
  `PASSWORDANSWER` varchar(45) DEFAULT NULL COMMENT '瀵嗙爜绛旀',
  `APPLOGINAUTHNTYPE` tinyint unsigned DEFAULT '0' COMMENT '搴旂敤鐧诲綍璁よ瘉绫诲瀷',
  `APPLOGINPASSWORD` varchar(45) DEFAULT NULL COMMENT '搴旂敤鐧诲綍瀵嗙爜',
  `PROTECTEDAPPS` varchar(450) DEFAULT NULL COMMENT '搴旂敤鐧诲綍瀵嗙爜淇濇姢搴旂敤',
  `THEME` varchar(45) DEFAULT 'default' COMMENT '涓婚',
  `GRIDLIST` tinyint unsigned DEFAULT '0' COMMENT '搴旂敤鍒楄〃绫诲瀷',
  `LOGINCOUNT` int unsigned DEFAULT '0' COMMENT '鐧诲綍娆℃暟缁熻',
  `ONLINE` tinyint unsigned DEFAULT '0' COMMENT '鍦ㄧ嚎鐘舵€?,
  `STATUS` tinyint unsigned DEFAULT '1' COMMENT '鐢ㄦ埛鐘舵€?,
  `ISLOCKED` tinyint unsigned DEFAULT '1' COMMENT '閿佸畾鐘舵€?,
  `UNLOCKTIME` datetime DEFAULT '2020-01-01 01:01:01' COMMENT '瑙ｉ攣鏃堕棿',
  `LASTLOGINIP` varchar(300) DEFAULT NULL COMMENT '鏈€杩戠櫥褰旾P鍦板潃',
  `LASTLOGINTIME` datetime DEFAULT '2020-01-01 01:01:01' COMMENT '鏈€杩戠櫥褰曟椂闂?,
  `LASTLOGOFFTIME` datetime DEFAULT '2020-01-01 01:01:01' COMMENT '鏈€杩戞敞閿€鏃堕棿',
  `BADPASSWORDTIME` datetime DEFAULT '2020-01-01 01:01:01' COMMENT '鏈€杩戝瘑鐮侀敊璇椂闂?,
  `BADPASSWORDCOUNT` smallint unsigned DEFAULT NULL COMMENT '瀵嗙爜閿欒娆℃暟',
  `PASSWORDLASTSETTIME` datetime DEFAULT '2020-01-01 01:01:01' COMMENT '鏈€杩戝瘑鐮佷慨鏀规椂闂?,
  `PASSWORDSETTYPE` tinyint unsigned DEFAULT '0' COMMENT '瀵嗙爜閲嶇疆绫诲瀷',
  `SHAREDSECRET` varchar(500) DEFAULT NULL COMMENT 'TIME-OPT瀵嗛挜',
  `SHAREDCOUNTER` varchar(45) DEFAULT '0' COMMENT 'COUNTER-OPT瀵嗛挜',
  `USERTYPE` varchar(45) DEFAULT 'Customer' COMMENT '鐢ㄦ埛绫诲瀷',
  `USERSTATE` varchar(45) DEFAULT 'RESIDENT',
  `EMPLOYEENUMBER` varchar(45) DEFAULT NULL COMMENT '宸ュ彿',
  `WINDOWSACCOUNT` varchar(45) DEFAULT NULL COMMENT 'AD鍩熻处鍙?,
  `DIVISION` varchar(45) DEFAULT NULL COMMENT '鍒嗘敮',
  `COSTCENTER` varchar(45) DEFAULT NULL COMMENT '鎴愭湰涓績',
  `ORGANIZATION` varchar(45) DEFAULT NULL COMMENT '鏈烘瀯',
  `DEPARTMENTID` varchar(45) DEFAULT NULL COMMENT '閮ㄩ棬缂栧彿',
  `DEPARTMENT` varchar(45) DEFAULT NULL COMMENT '閮ㄩ棬',
  `JOBTITLE` varchar(45) DEFAULT NULL COMMENT '鑱屽姟',
  `JOBLEVEL` varchar(45) DEFAULT NULL COMMENT '宸ヤ綔鑱岀骇',
  `MANAGERID` varchar(45) DEFAULT NULL COMMENT '缁忕悊缂栧彿',
  `MANAGER` varchar(45) DEFAULT NULL COMMENT '缁忕悊鍚嶅瓧',
  `ASSISTANTID` varchar(45) DEFAULT NULL COMMENT '鍔╃悊缂栧彿',
  `ASSISTANT` varchar(45) DEFAULT NULL COMMENT '鍔╃悊鍚嶅瓧',
  `ENTRYDATE` varchar(45) DEFAULT NULL COMMENT '鍏ュ徃鏃堕棿',
  `STARTWORKDATE` varchar(45) DEFAULT NULL COMMENT '寮€濮嬪伐浣滄椂闂?,
  `QUITDATE` varchar(45) DEFAULT NULL COMMENT '绂昏亴鏃ユ湡',
  `SORTINDEX` tinyint unsigned DEFAULT '1' COMMENT '閮ㄩ棬鍐呮帓搴?,
  `WORKEMAIL` varchar(45) DEFAULT NULL COMMENT '宸ヤ綔-閭欢',
  `WORKPHONENUMBER` varchar(45) DEFAULT NULL COMMENT '宸ヤ綔-鐢佃瘽',
  `WORKCOUNTRY` varchar(45) DEFAULT 'CHN' COMMENT '宸ヤ綔-鍥藉',
  `WORKREGION` varchar(45) DEFAULT NULL COMMENT '宸ヤ綔-鐪?甯?,
  `WORKLOCALITY` varchar(45) DEFAULT NULL COMMENT '宸ヤ綔-鍩庡競',
  `WORKSTREETADDRESS` varchar(45) DEFAULT NULL COMMENT '宸ヤ綔-琛楅亾',
  `WORKADDRESSFORMATTED` varchar(45) DEFAULT NULL COMMENT '宸ヤ綔-鍦板潃鍏ㄧО',
  `WORKPOSTALCODE` varchar(45) DEFAULT NULL COMMENT '宸ヤ綔-閭紪',
  `WORKFAX` varchar(45) DEFAULT NULL COMMENT '宸ヤ綔-浼犵湡',
  `WORKOFFICENAME` varchar(500) DEFAULT NULL,
  `GIVENNAME` varchar(45) DEFAULT NULL COMMENT '鍚?,
  `MIDDLENAME` varchar(45) DEFAULT NULL COMMENT '涓棿鍚?,
  `FAMILYNAME` varchar(45) DEFAULT NULL COMMENT '濮?,
  `HONORIFICPREFIX` varchar(45) DEFAULT NULL COMMENT '鍓嶇紑',
  `HONORIFICSUFFIX` varchar(45) DEFAULT NULL COMMENT '鍚庣紑',
  `FORMATTEDNAME` varchar(400) DEFAULT NULL COMMENT '鐢ㄦ埛鍏ㄥ悕',
  `IDTYPE` tinyint unsigned DEFAULT '0' COMMENT '璇佷欢绫诲瀷',
  `IDCARDNO` varchar(45) DEFAULT NULL COMMENT '璇佷欢鍙风爜',
  `EDUCATION` varchar(200) DEFAULT NULL COMMENT '瀛﹀巻',
  `GRADUATEFROM` varchar(500) DEFAULT NULL COMMENT '姣曚笟闄㈡牎',
  `GRADUATEDATE` varchar(45) DEFAULT NULL COMMENT '姣曚笟鏃ユ湡',
  `MARRIED` tinyint unsigned DEFAULT '0' COMMENT '濠氬Щ鐘舵€?,
  `BIRTHDATE` varchar(45) DEFAULT NULL COMMENT '鐢熸棩',
  `NAMEZHSPELL` varchar(100) DEFAULT NULL COMMENT '鍚嶅瓧涓枃鎷奸煶',
  `NAMEZHSHORTSPELL` varchar(45) DEFAULT NULL COMMENT '鍚嶅瓧涓枃鎷奸煶绠€绉?,
  `GENDER` tinyint unsigned DEFAULT NULL COMMENT '鎬у埆',
  `WEBSITE` varchar(50) DEFAULT NULL COMMENT '涓汉涓婚〉',
  `WEIXINFOLLOW` tinyint unsigned DEFAULT NULL COMMENT '寰俊鍏虫敞',
  `DEFINEIM` varchar(45) DEFAULT NULL COMMENT 'IM璐﹀彿',
  `HOMEEMAIL` varchar(45) DEFAULT NULL COMMENT '瀹跺涵-閭欢',
  `HOMEPHONENUMBER` varchar(45) DEFAULT NULL COMMENT '瀹跺涵-鐢佃瘽',
  `HOMECOUNTRY` varchar(45) DEFAULT 'CHN' COMMENT '瀹跺涵-鐪?甯?,
  `HOMEREGION` varchar(45) DEFAULT NULL COMMENT '瀹跺涵-甯?,
  `HOMELOCALITY` varchar(45) DEFAULT NULL COMMENT '瀹跺涵-鍖?,
  `HOMESTREETADDRESS` varchar(45) DEFAULT NULL COMMENT '瀹跺涵-琛楅亾',
  `HOMEADDRESSFORMATTED` varchar(45) DEFAULT NULL COMMENT '瀹跺涵-鍦板潃鍏ㄧО',
  `HOMEPOSTALCODE` varchar(45) DEFAULT NULL COMMENT '瀹跺涵-閭紪',
  `HOMEFAX` varchar(45) DEFAULT NULL COMMENT '瀹跺涵-浼犵湡',
  `EXTRAATTRIBUTE` varchar(4000) DEFAULT NULL COMMENT '鐢ㄦ埛鎵╁睍灞炴€?,
  `CREATEDBY` varchar(45) DEFAULT NULL COMMENT '鍒涘缓浜?,
  `CREATEDDATE` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '鍒涘缓鏃堕棿',
  `MODIFIEDBY` varchar(45) DEFAULT NULL COMMENT '淇敼浜?,
  `MODIFIEDDATE` datetime DEFAULT NULL COMMENT '淇敼鏃堕棿',
  `DESCRIPTION` varchar(400) DEFAULT NULL COMMENT '鎻忚堪',
  `LDAPDN` varchar(1000) DEFAULT NULL,
  `INSTID` varchar(45) NOT NULL,
  `Regionhistory` text,
  `passwordhistory` text,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `USERNAME_UNIQUE` (`USERNAME`),
  KEY `EMPLOYEENUMBER_UNIQUE` (`EMPLOYEENUMBER`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='USER INFO DEFINE';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sync_job_config_field`
--

DROP TABLE IF EXISTS `sync_job_config_field`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sync_job_config_field` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `jobid` bigint NOT NULL DEFAULT '0' COMMENT '鍚屾浠诲姟ID',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '瑙勫垯鍚?,
  `objecttype` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '绫诲瀷',
  `targetfield` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '鐩爣瀛楁',
  `targetfieldname` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '鐩爣瀛楁鎻忚堪',
  `sourcefield` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '鏉ユ簮瀛楁',
  `sourcefieldname` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '鏉ユ簮瀛楁鎻忚堪',
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '' COMMENT '鎻忚堪',
  `createuser` bigint DEFAULT '0' COMMENT '鍒涘缓浜?,
  `createtime` datetime DEFAULT NULL COMMENT '鍒涘缓鏃堕棿',
  `updateuser` bigint DEFAULT '0' COMMENT '淇敼浜?,
  `updatetime` datetime DEFAULT NULL COMMENT '淇敼鏃堕棿',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_job_id` (`jobid`) USING BTREE COMMENT '鍚屾浠诲姟ID绱㈠紩'
) ENGINE=InnoDB AUTO_INCREMENT=214 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='鍚屾浠诲姟瀛楁鏄犲皠琛?;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-28 22:30:00

