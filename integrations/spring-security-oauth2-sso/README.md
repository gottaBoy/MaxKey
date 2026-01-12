# Spring Security OAuth SSO

### 椤圭洰婧愬湴鍧€

https://gitee.com/hhw3KevinHou/spring-security-oauth2-sso.git 


#### 浠嬬粛
閮ㄧ讲涓€涓狾Auth 2.0鏈嶅姟鍣紝渚嬪Sophon銆?

寤虹珛2涓崗璁负 OAuth_v2.1鐨勫簲鐢紝瀵瑰簲spring-demo-client1锛宻pring-demo-client2锛岃鍙‘璁よ缃负鑷姩锛岃繖鏍蜂笉闇€瑕佺敤鎴锋墜鍔ㄦ巿鏉冦€傝缃闂帶鍒躲€?





杩愯spring-demo-client1锛宻pring-demo-client2

璁块棶http://localhost:8080/hello锛岃嚜鍔ㄨ烦杞櫥褰曢〉闈紝鐧诲綍鎴愬姛銆?

璁块棶http://localhost:8081/hello锛屼笉闇€瑕佺櫥褰曘€?



浠讳綍涓€涓猯ogout锛屽叏灞€閫€鍑恒€?



## 鍗曠偣鐧诲綍杩囩▼

璁块棶http://localhost:8081/hello锛屽彂鐜皊pring-demo-client2鏈湴搴旂敤娌℃湁鐧诲綍

```

spring-demo-client2 鍙戣捣鐧诲綍璇锋眰锛?
redirect鍒帮細http://sso.Sophon.top/sign/authz/oauth/v20/authorize?client_id=830517174152986624&redirect_uri=http://localhost:8081/login&response_type=code&state=8GAmwd'

鏄剧ずmakey鐧诲綍鐣岄潰
鐢ㄦ埛鐧诲綍鍚?
Sophon鏍规嵁搴旂敤璁剧疆锛屼娇鐢ㄨ嚜鍔╝pprove锛屼笉闇€瑕佺敤鎴风偣鍑绘巿鏉冦€?
redirect鍒帮細http://localhost:8081/login?code=72107fc4-5305-4aa5-a8d0-14da30ed0ca1&state=8GAmwd

spring-demo-client2 鐨剆pring security鑷姩澶勭悊锛岃幏鍙朼ccess_token锛?
璋冪敤锛歨ttp://sso.Sophon.top/sign/authz/oauth/v20/token
鍙傛暟涓猴細
{
    grant_type=[authorization_code], 
    code=[72107fc4-5305-4aa5-a8d0-14da30ed0ca1], 
    redirect_uri=[http://localhost:8081/login], 
    client_id=[830517174152986624], 
    client_secret=[ElHEMDcwMzIwMjMxNjE5NTAyMTIx1K]
}
寰楀埌access_token锛歞bff79de-6efa-4148-aedb-333325dc30c0

spring-demo-client2鐨剆pring security浣跨敤寰楀埌access_token鑷姩鑾峰彇鐢ㄦ埛淇℃伅锛?
http://sso.Sophon.top/sign/api/oauth/v20/me

spring-demo-client2寰楀埌鐢ㄦ埛淇℃伅鍚庤繑鍥炲墠绔細
http://localhost:8081/hello

```



璁块棶http://localhost:8080/hello锛屽彂鐜皊pring-demo-client1鏈湴搴旂敤娌℃湁鐧诲綍

```
spring-demo-client1 鍙戣捣鐧诲綍璇锋眰锛?
'http://sso.Sophon.top/sign/authz/oauth/v20/authorize?client_id=830447866781630464&redirect_uri=http://localhost:8080/login&response_type=code&state=ZZXxk5'

makey鐨勬嫤鎴櫒鍙戠幇鎺堟潈涓績宸茬粡鐧诲綍锛坈ookie閲屾湁jwt token锛?
鑷姩approve锛屼笉闇€瑕佺敤鎴风偣鍑绘巿鏉冦€?
redirect鍒帮細http://localhost:8080/login?code=51f2ae07-7a1c-42ec-a663-be09080ab1d9&state=ZZXxk5

spring-demo-client1 鐨剆pring security鑷姩澶勭悊锛岃幏鍙朼ccess_token锛?
璋冪敤锛歨ttp://sso.Sophon.top/sign/authz/oauth/v20/token
鍙傛暟涓猴細
{
    grant_type=[authorization_code], 
    code=[51f2ae07-7a1c-42ec-a663-be09080ab1d9], 
    redirect_uri=[http://localhost:8080/login], 
    client_id=[830447866781630464], 
    client_secret=[QnGYMDcwMzIwMjMxMTQ0MjYwNDcFli]
}
寰楀埌access_token锛?5e277ae-06f2-4f43-af78-8046905b8cea

spring-demo-client1鐨剆pring security浣跨敤寰楀埌access_token鑷姩鑾峰彇鐢ㄦ埛淇℃伅锛?
http://sso.Sophon.top/sign/api/oauth/v20/me

spring-demo-client1寰楀埌鐢ㄦ埛淇℃伅鍚庤繑鍥炲墠绔細
http://localhost:8080/hello


```




