---
title: 楂樺彲鐢ㄦ€?
sidebar_position: 1
---
# 楂樺彲鐢ㄦ€?
High Availability

## 閫氬父鏋舵瀯
Architecture
![寰湇鍔℃灦鏋凪icroservice](/images/Sophon_ha.png)

## 寰湇鍔℃灦鏋?
Microservice Architecture

![寰湇鍔℃灦鏋凪icroservice](/images/Sophon_ha_micro.png)



## 楂樺彲鐢ㄦ€ч厤缃?

### 鐜鍑嗗
鍑嗗涓ゅ彴鏈嶅姟鍣紝骞跺畨瑁匨axKey

### Redis缂撳瓨鍑嗗

瀹夎Redis鏈嶅姟鎴栬€匯edis闆嗙兢

### 淇敼閰嶇疆鏂囦欢
鐩綍Sophon-v*GA/Sophon/涓互涓嬫枃浠?
```
application-https(http).properties
```
Sophon-web-Sophon*.jar涓殑

```
application-https(http).properties銆?
```

Redis閰嶇疆

```ini
#redis
spring.redis.host=127.0.0.1
spring.redis.port=6379
spring.redis.password=password
spring.redis.timeout=10000
spring.redis.jedis.pool.max-wait=1000
spring.redis.jedis.pool.max-idle=200
spring.redis.lettuce.pool.max-active=-1
spring.redis.lettuce.pool.min-idle=0
```

鍚姩Sessions瀛樺偍鍦≧edis閰嶇疆(v3.5.0涔嬪墠鐗堟湰)

```ini
# Session store type.
spring.session.store-type=redis
# Session timeout. If a duration suffix is not specified, seconds is used.
server.servlet.session.timeout=1800
# Sessions flush mode.
spring.session.redis.flush-mode=on_save 
# Namespace for keys used to store sessions.
spring.session.redis.namespace=spring:session 
```

### Nginx杞彂閰嶇疆

  璇峰弬鐓ginx瀹樻柟缃戠珯瀹屾垚閰嶇疆
  
  nginx-1.19.9鍏抽敭杞彂閰嶇疆濡備笅
  
```
    #鏈嶅姟鍣ㄧ殑闆嗙兢Sophoncluster ,weight鏄潈閲嶇殑鎰忔€濓紝鏉冮噸瓒婂ぇ锛屽垎閰嶇殑姒傜巼瓒婂ぇ銆?
    upstream  sso.Sophon.top{  
       server    127.0.0.1:8080  weight=10;
       #server    127.0.0.1:8082  weight=10;  
	   ip_hash;
    } 
	
    server {
        listen       443 ssl;
        server_name  localhost;

        ssl_certificate      C:/IDES/nginx-1.19.9/Sophon.pem;
        ssl_certificate_key  C:/IDES/nginx-1.19.9/Sophon.key;

        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;

        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;

        location / {
            root   html;
            index  index.html index.htm;
        }
		
        #鏈嶅姟鍣ㄩ泦缇よ矾寰?
        location /Sophon/ {
            proxy_pass http://sso.Sophon.top/Sophon/;
        }
    }
```


### 璇佷功绛惧彂

璇峰弬鐓у浣曠敤acme.sh鐢宠璇佷功

<a href ="https://github.com/acmesh-official/acme.sh/wiki/How-to-issue-a-cert">鑻辨枃 </a>

<a href ="https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E" >涓枃 </a>
