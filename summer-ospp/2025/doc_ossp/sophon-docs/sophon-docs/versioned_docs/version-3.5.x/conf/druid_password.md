---
title: Druid閰嶇疆鏁版嵁搴撳姞瀵?
sidebar_position: 9
---

Druid 鏄竴涓?JDBC 缁勪欢搴擄紝鍖呭惈鏁版嵁搴撹繛鎺ユ睜銆丼QL Parser 绛夌粍浠? 琚ぇ閲忎笟鍔″拰鎶€鏈骇鍝佷娇鐢ㄦ垨闆嗘垚锛岀粡鍘嗚繃鏈€涓ヨ嫑绾夸笂涓氬姟鍦烘櫙鑰冮獙锛屾槸浣犲€煎緱淇¤禆鐨勬妧鏈骇鍝併€?

## 瀵煎叆Druid渚濊禆
gradle.properties
```
druidVersion                    =1.2.15
druidspringbootstarterVersion   =1.2.15
```

build.gradle
```
implementation group: 'com.alibaba', name: 'druid', version: "${druidVersion}"
implementation group: 'com.alibaba', name: 'druid-spring-boot-starter', version: "${druidspringbootstarterVersion}"
```
鐗堟湰鏍规嵁瀹為檯鎯呭喌杩涜鏇存柊锛屽綋鍓嶇増鏈?.2.15

## 鍛戒护绐楀彛涓墽琛?

```java
java -cp druid-1.2.15.jar com.alibaba.druid.filter.config.ConfigTools 鏁版嵁搴撳瘑鐮?
```

鍋囪鏁版嵁搴撳瘑鐮佹槸**Sophon**,鍛戒护濡備笅

![druid_encrypt](/images/config/druid_encrypt.png)

## 椤圭洰閰嶇疆鏂囦欢
1銆乫ilters娣诲姞config

2銆侀厤缃В瀵嗭紝鍚屾椂鎸囧畾鍏挜

鐢熸垚鐜寤鸿濡備笅閰嶇疆閫氳繃java-jar鍚姩鍛戒护鏃舵寚瀹歴pring.druid.publickey鐨勫€?java -jar xx.jar --spring.druid.publickey=鍏挜)锛岄伩鍏嶉€氳繃yml鑾峰彇鍒板叕閽ワ紝寮€鍙戠幆澧冨彲灏嗗叕閽ラ厤缃湪idea鍚姩鍙傛暟鍐呫€?

```ini
spring.druid.publickey=MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIOu1Ew3t8xLDoaVs1byFllwf55yRqz1ekJviQ7wWsuYnOL4WWsIb7tUj9foiYt58kdua6rWcVBAsTjHHR4tLPECAwEAAQ==
spring.datasource.username=root
spring.datasource.password=F78ZV92w6MtSfMajYRqHDeorcColhpMiIokwfl2ecFLAhKS6gPMxzAEJgALtssonYNx0aDFQnQ0/ZjMhxeqL7w==
spring.datasource.filters=config
spring.datasource.connectionProperties=config.decrypt=true;config.decrypt.key=${spring.druid.publickey}
```
