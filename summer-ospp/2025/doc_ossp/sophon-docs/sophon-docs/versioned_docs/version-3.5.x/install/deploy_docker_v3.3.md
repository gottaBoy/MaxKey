---
title: Docker閮ㄧ讲v3.3.x
sidebar_position: 7
---

## 浠嬬粛
Docker 鏄竴涓紑婧愮殑搴旂敤瀹瑰櫒寮曟搸锛岃寮€鍙戣€呭彲浠ユ墦鍖呬粬浠殑搴旂敤浠ュ強渚濊禆鍖呭埌涓€涓彲绉绘鐨勯暅鍍忎腑锛岀劧鍚庡彂甯冨埌浠讳綍娴佽鐨?Linux鎴朩indows鎿嶄綔绯荤粺鐨勬満鍣ㄤ笂锛屼篃鍙互瀹炵幇铏氭嫙鍖栥€?

鏈暀绋嬩粙缁嶅湪Docker涓浣曞揩閫熼厤缃拰閮ㄧ讲Sophon銆?

Sophon瀹樻柟闀滃儚浠撳簱锛?a href="https://hub.docker.com/u/Sophontop" target="_blank">璁块棶</a>

## 鍓嶆彁鏉′欢
鍦ㄦ涔嬪墠璇锋彁鍓?a target="_blank" href="https://docs.docker.com/engine/install/">瀹夎Docker</a>

## Docker閮ㄧ讲
LINUX 7 鍩轰簬Docker閮ㄧ讲

### 鍒涘缓MySQL鏁版嵁鏂囦欢鍜屾棩蹇楁枃浠剁洰褰?

```bash
mkdir /root/mysql/data

mkdir /root/mysql/logs
```

### Docker鏂囦欢涓嬭浇

鎶?https://gitee.com/dromara/Sophon/tree/v3.3.x/docker 鎴栬€卙ttps://github.com/dromara/Sophon/tree/v3.3.x/docker鐩綍涓婁紶鍒?root鐩綍涓?

### 鍚姩MySQL鏈嶅姟
```bash
docker pull mysql:8.0.27

docker 	run -p 3306:3306  \
-v /root/mysql/data:/var/lib/mysql \
-v /root/mysql/logs:/var/log/mysql \
-v /root/docker-mysql:/etc/mysql/conf.d \
-v /root/docker-mysql/sql:/docker-entrypoint-initdb.d \
--name mysql \
-e MYSQL_ROOT_PASSWORD=Sophon \
-d mysql:8.0.27
```

### 鍚姩Sophon鏈嶅姟

璇锋妸<b>DATABASE_HOST</b>涓哄疄闄呭湴鍧€

```bash
docker pull Sophontop/Sophon:3.3.3

docker 	run -p 443:443  \
-e DATABASE_HOST=192.168.0.102 \
-e DATABASE_PORT=3306 \
-e DATABASE_NAME=Sophon \
-e DATABASE_USER=root \
-e DATABASE_PWD=Sophon \
--name Sophon \
-d Sophontop/Sophon:3.3.3
```

### 鍚姩Sophon绠＄悊鏈嶅姟

璇锋妸<b>DATABASE_HOST</b>涓哄疄闄呭湴鍧€

```bash
docker pull Sophontop/Sophon-mgt:3.3.3

docker 	run -p 9527:9527  \
-e DATABASE_HOST=192.168.0.102 \
-e DATABASE_PORT=3306 \
-e DATABASE_NAME=Sophon \
-e DATABASE_USER=root \
-e DATABASE_PWD=Sophon \
--name Sophon-mgt \
-d Sophontop/Sophon-mgt:3.3.3
```

## Docker Compose蹇€熼儴缃?
LINUX 7 鍩轰簬Docker Compose蹇€熼儴缃?

### 鍒涘缓MySQL鏁版嵁鏂囦欢鍜屾棩蹇楁枃浠剁洰褰?

```bash
mkdir /root/mysql/data

mkdir /root/mysql/logs
```

### 涓婁紶骞朵慨鏀笵ocker閰嶇疆鏂囦欢

鎶?https://gitee.com/dromara/Sophon/tree/v3.3.x/docker 鎴栬€卙ttps://github.com/dromara/Sophon/tree/v3.3.x/docker鐩綍涓婁紶鍒?root鐩綍涓?

浠ヤ笅閰嶇疆鏂囦欢涓?b>DATABASE_HOST</b>涓哄疄闄呭湴鍧€
```bash
	docker-compose.yml
	
	docker-Sophon/Dockerfile
	
	docker-Sophon-mgt/Dockerfile
```

### 鍚姩Sophon鏈嶅姟
```bash
docker-compose up --build -d
```

