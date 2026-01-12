---
title: LINUX閮ㄧ讲
sidebar_position: 4
---

# LINUX 7 鐗堟湰

## JDK鐗堟湰
<table border="0" class="table table-striped table-bordered ">
	<thead>
		<tr>
			<th>鎺ㄨ崘</th><th>鐗堟湰</th><th>鏇存柊鑷?/th><th>鍦板潃</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>鉁?/td>
			<td>Oracle JDK 8</td>
			<td>December 2030</td>
			<td><a href="https://www.oracle.com/java/technologies/downloads/#JDK17" target="blank">璁块棶</a></td>
			
		</tr>
		<tr>
			<td>鉁?/td>
			<td>Eclipse Temurin 8</td>
			<td>December 2030</td>
			<td><a href="https://adoptium.net/?variant=openjdk8&jvmVariant=hotspot" target="blank">璁块棶</a></td>
			
		</tr>
		<tr>
			<td></td>
			<td>OracleJDK 17</td>
			<td>October 2029</td>
			<td><a href="https://www.oracle.com/java/technologies/downloads/#java8" target="blank">璁块棶</a></td>
		</tr>
		<tr>
			<td></td>
			<td>Eclipse Temurin 17</td>
			<td>October 2029</td>
			<td><a href="https://adoptium.net/?variant=openjdk17&jvmVariant=hotspot" target="blank">璁块棶</a></td>
			
		</tr>
	</tbody>
</table>

<a href="https://www.oracle.com/java/technologies/java-se-support-roadmap.html" target="blank">Oracle Java SE 鏀寔璺嚎鍥?/a>

## JDK 瀹夎

### 涓嬭浇鍦板潃

Eclipse Temurin 8  x64 RPM Package

鍋囪褰撳墠瀹夎鐩綍/root
	
```bash
curl -L "https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u332-b09/OpenJDK8U-jdk_x64_linux_hotspot_8u332b09.tar.gz" -H "Cookie: oraclelicense=accept-securebackup-cookie"  -H "Connection: keep-alive" -O  
```
 
### 瑙ｅ帇缂╁強瀹夎

```bash
tar -zxf OpenJDK8U-jdk_x64_linux_hotspot_8u332b09.tar.gz
```

瀹屾垚鍚庢湰鍦扮洰褰?

```
jdk8u332-b09
```

## 瀹夎閰嶇疆MySQL 8.0

### 瀹夎MySQL 8.0
鍋囧鏈湴瀹夎杩噈ariadb锛岃鍏堝嵏杞?

#### 瀹夎MySQL瀹樻柟鐨剏um repository

```bash
curl -L  "https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm"  -O 
```
 
#### 涓嬭浇rpm鍖咃細

```bash
yum -y install mysql80-community-release-el7-3.noarch.rpm
```
 
#### 瀹夎MySQL鏈嶅姟
 
```bash
yum -y install mysql-community-server
```

#### 瀹夎MySQL闂

```
Failing package is: mysql-community-libs-compat-8.0.28-1.el7.x86_64  GPG Keys are configured as: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
```

瑙ｅ喅鏂规

```bash
rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
```

### 璋冩暣閰嶇疆

缂栬緫 /etc/my.cnf 鏂囦欢

```ini
character-set-server=utf8
lower_case_table_names=1
```
 
### 鍚姩mysql鏈嶅姟
```bash
    systemctl start mysqld
	
	--鍋滄
	
	systemctl stop mysqld  --鏃犻渶鎵ц
```
	
### 鐧诲綍MySQL

 绗竴娆″惎鍔∕ySQL鍚庯紝灏变細鏈変复鏃跺瘑鐮侊紝杩欎釜榛樿鐨勫垵濮嬪瘑鐮佸湪/var/log/mysqld.log鏂囦欢涓紝鎴戜滑鍙互鐢ㄨ繖涓懡浠ゆ潵鏌ョ湅锛?
 
```bash
 grep "password" /var/log/mysqld.log
```
 
### 璁剧疆璁块棶鏉冮檺鍙婂瘑鐮?
```bash

mysql -u root -p;

杈撳叆瀵嗙爜

```

```sql
--浠ヤ笅姝ラ鍙兘瑕佹眰鍏堜慨鏀瑰垵濮嬪寲瀵嗙爜涓哄鏉傚瘑鐮?SET PASSWORD = 'UDF(ez/8Lufi';

set global validate_password.policy=0; --鏀瑰彉瀵嗙爜绛夌骇

set global validate_password.length=4; --鏀瑰彉瀵嗙爜鏈€灏忛暱搴?

SET PASSWORD = 'Sophon';

use mysql;

alter user 'root'@'localhost' identified with mysql_native_password by 'Sophon';

flush privileges ;

---淇敼root鐢ㄦ埛鐨勮闂潈闄愪负鈥?鈥?

update user set host='%' where user='root';

flush privileges ;

```
 
### 璁剧疆寮€鏈哄惎鍔?

```
chkconfig --add mysqld
chkconfig mysqld on
```

鏌ョ湅寮€鏈哄惎鍔ㄨ缃槸鍚︽垚鍔?

```
 chkconfig --list | grep mysql*
 
 # mysqld 0:鍏抽棴 1:鍏抽棴 2:鍚敤 3:鍚敤 4:鍚敤 5:鍚敤 6:鍏抽棴鍋滄
```


## Sophon瀹夎

### 鎶奙axKey涓婁紶鍒癓inux鏈嶅姟鍣?

### 鏁版嵁瀵煎叆

Sophon瀵瑰簲鐨勭増鏈琒QL鏂囦欢锛屽弬瑙?

https://gitee.com/dromara/Sophon/tree/master/sql/v3.5.0.ga/

鐧婚檰LINUX MYSQL骞跺垱寤簊chema Sophon锛屽瓧绗﹂泦utf8,鏁版嵁鏂囦欢瀵煎叆鍒癿axkey schema涓紝

```bash

mysql -u root -p;

杈撳叆瀵嗙爜
```

```sql
CREATE DATABASE  IF NOT EXISTS `Sophon` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `Sophon`;

-- 浣跨敤source鍛戒护锛屽悗闈㈠弬鏁颁负鑴氭湰鏂囦欢(濡傝繖閲岀敤鍒扮殑.sql),鍏朵腑v3.5.0鏄搴旂殑鐗堟湰鍙?

source your sql path/Sophon_v3.5.0.GA.sql;

source your sql path/Sophon_v3.5.0.GA_data.sql

```


### 閰嶇疆hosts

hosts閰嶇疆鏂囦欢鐩綍

```
vi /etc/hosts
```

鏂板濡備笅鍐呭

```
127.0.0.1  sso.Sophon.top
127.0.0.1  mgt.Sophon.top
127.0.0.1  tokenbased.demo.Sophon.top
127.0.0.1  cas.demo.Sophon.top
127.0.0.1  oauth.demo.Sophon.top
```

### 鍚姩

淇敼set_Sophon_env.sh浠ヤ笅鍙傛暟锛?root/涓哄畨瑁呰矾寰?

```
JAVA_HOME=/root/jdk8u332-b09

export JAVA_HOME=/root/jdk8u332-b09
```


```bash
  ./start_Sophon_db.sh & #鑷缂栧啓
  
  ./start_Sophon.sh &
  
  ./start_Sophon_mgt.sh &
  
  ./start_Sophon_demo.sh &
```

## 鍓嶇鏈嶅姟閮ㄧ讲

瀹夎nginx,鍙傝€僿indows鐗堟湰閰嶇疆锛屽啀鎶妛indows鐗堟湰鍓嶇鏂囦欢鏀惧叆瀵瑰簲鐨刵ginx鐩綍涓?

## 浠ｇ悊鏈嶅姟閮ㄧ讲

瀹夎nginx,鍙傝€僿indows鐗堟湰鐨勪唬鐞嗛厤缃?

