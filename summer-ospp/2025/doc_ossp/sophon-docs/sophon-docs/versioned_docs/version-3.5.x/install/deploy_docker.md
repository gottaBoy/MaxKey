---
title: Docker閮ㄧ讲
sidebar_position: 3
---
## 浠嬬粛
Docker 鏄竴涓紑婧愮殑搴旂敤瀹瑰櫒寮曟搸锛岃寮€鍙戣€呭彲浠ユ墦鍖呬粬浠殑搴旂敤浠ュ強渚濊禆鍖呭埌涓€涓彲绉绘鐨勯暅鍍忎腑锛岀劧鍚庡彂甯冨埌浠讳綍娴佽鐨?Linux鎴朩indows鎿嶄綔绯荤粺鐨勬満鍣ㄤ笂锛屼篃鍙互瀹炵幇铏氭嫙鍖栥€?

鏈暀绋嬩粙缁嶅湪Docker涓浣曞揩閫熼厤缃拰閮ㄧ讲Sophon銆?

Sophon瀹樻柟闀滃儚浠撳簱锛?a href="https://hub.docker.com/u/Sophontop" target="_blank">璁块棶</a>

## 鍓嶆彁鏉′欢
鍦ㄦ涔嬪墠璇锋彁鍓?a target="_blank" href="https://docs.docker.com/engine/install/">瀹夎Docker</a>

## Docker閮ㄧ讲
LINUX 7 鍩轰簬Docker閮ㄧ讲

### 鍒涘缓docker缃戠粶杩炴帴

```bash
docker network create Sophon.top
```

### Docker鏂囦欢涓嬭浇

鎶?https://gitee.com/dromara/Sophon/tree/main/docker 鎴栬€卙ttps://github.com/dromara/Sophon/tree/main/docker鐩綍涓婁紶鍒?root鐩綍涓?

### 鍚姩MySQL鏈嶅姟
```bash
docker pull mysql:8.0.27

docker run -p 3306:3306   \
-v ./docker-mysql/data:/var/lib/mysql \
-v ./docker-mysql/logs:/var/log/mysql \
-v ./docker-mysql/conf.d:/etc/mysql/conf.d  \
-v ./docker-mysql/docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d  \
--name mysql  \
--hostname mysql \
--network Sophon.top \
-e MYSQL_ROOT_PASSWORD=Sophon  \
-d mysql:8.0.27 
```

### 鍚姩Sophon鏈嶅姟

璇锋妸<b>DATABASE_HOST</b>涓哄疄闄呭湴鍧€

```bash
docker pull Sophontop/Sophon:latest

docker 	run -p 9527:9527  \
-e DATABASE_HOST=mysql \
-e DATABASE_PORT=3306 \
-e DATABASE_NAME=Sophon \
-e DATABASE_USER=root \
-e DATABASE_PWD=Sophon \
--name Sophon \
--hostname Sophon \
--network Sophon.top \
-d Sophontop/Sophon:latest 
```

### 鍚姩Sophon绠＄悊鏈嶅姟

璇锋妸<b>DATABASE_HOST</b>涓哄疄闄呭湴鍧€

```bash
docker pull Sophontop/Sophon-mgt:latest

docker 	run -p 9526:9526  \
-e DATABASE_HOST=mysql \
-e DATABASE_PORT=3306 \
-e DATABASE_NAME=Sophon \
-e DATABASE_USER=root \
-e DATABASE_PWD=Sophon \
--name Sophon-mgt \
--hostname Sophon-mgt \
--network Sophon.top \
-d Sophontop/Sophon-mgt:latest 
```


### 鍚姩Sophon璁よ瘉鍓嶇鏈嶅姟

```bash
docker pull Sophontop/Sophon-frontend:latest

docker 	run -p 8527:8527  \
--name Sophon-frontend \
--hostname Sophon-frontend \
--network Sophon.top \
-d Sophontop/Sophon-frontend:latest 
```

### 鍚姩Sophon绠＄悊鍓嶇鏈嶅姟

```bash
docker pull Sophontop/Sophon-mgt-frontend:latest

docker 	run -p 8526:8526  \
--name Sophon-mgt-frontend \
--hostname Sophon-mgt-frontend \
--network Sophon.top \
-d Sophontop/Sophon-mgt-frontend:latest 
```


### 鍚姩Sophon浠ｇ悊鏈嶅姟

杩涘叆docker-nginx

```bash
cd docker-nginx

docker build -f Dockerfile -t Sophontop/Sophon-nginx .

docker 	run -p 80:80  \
--name Sophon-nginx \
--hostname Sophon-mgt-frontend \
--network Sophon.top \
-d Sophontop/Sophon-nginx
```
