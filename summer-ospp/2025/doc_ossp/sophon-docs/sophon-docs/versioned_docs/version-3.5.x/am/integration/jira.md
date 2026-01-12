---
title:  Jira闆嗘垚鎸囧崡
sidebar_position: 10
---

## Atlassian Jira浠嬬粛
JIRA鏄疉tlassian鍏徃鍑哄搧鐨勯」鐩笌浜嬪姟璺熻釜宸ュ叿锛岃骞挎硾搴旂敤浜庣己闄疯窡韪€佸鎴锋湇鍔°€侀渶姹傛敹闆嗐€佹祦绋嬪鎵广€佷换鍔¤窡韪€侀」鐩窡韪拰鏁忔嵎绠＄悊绛夊伐浣滈鍩熴€?

JIRA涓厤缃伒娲汇€佸姛鑳藉叏闈€侀儴缃茬畝鍗曘€佹墿灞曚赴瀵岋紝鍏惰秴杩?50椤圭壒鎬у緱鍒颁簡鍏ㄧ悆115涓浗瀹惰秴杩?9,000瀹跺鎴风殑璁ゅ彲銆?

瀹樻柟缃戠珯鍦板潃锛歨ttps://www.atlassian.com/software/jira

## Jira瀹夎閰嶇疆
### Jira 瀹夎
璇峰弬鐓у畼鏂规枃妗?
https://confluence.atlassian.com/adminjiraserver0813/installing-jira-applications-1027137422.html

瀹夎璺緞D:\Sophon\3party\Jira8.13.10

鏁版嵁璺緞D:\Sophon\3party\Jira8.13.10_data

### Jira鍚姩https
淇敼D:\Sophon\3party\Jira8.13.10\conf

```xml
<Connector  port="8443" protocol="org.apache.coyote.http11.Http11Protocol"
            maxHttpHeaderSize="8192" SSLEnabled="true"
            maxThreads="150" minSpareThreads="25" maxSpareThreads="75"
            enableLookups="false" disableUploadTimeout="true"
            acceptCount="100" scheme="https" secure="true"
            // highlight-start
            keystoreFile="D:/Sophon/3party/Jira8.13.10/conf/Sophonserver.keystore" keystorePass="Sophon"
            // highlight-end
            clientAuth="false" sslProtocol="TLS" useBodyEncodingForURI="true"/>
```

### 璁よ瘉閰嶇疆
閰嶇疆璁よ瘉鏈嶅姟锛岃繘鍏ira锛屽叿浣撻厤缃叆涓?
<img src="/doc/images/integration/jira/1.png"  />
<img src="/doc/images/integration/jira/2.png"  />
<img src="/doc/images/integration/jira/3.png"  />
鍩烘湰URL鏇存敼涓篽ttps://jira.Sophon.top:8443

<img src="/doc/images/integration/jira/4.png"  />
<img src="/doc/images/integration/jira/5.png"  />

澶囨敞:

鍗曚竴鐧诲綍鍙戣鑰?http://yourdomain/sign/saml

韬唤鎻愪緵鑰呭崟涓€鐧诲綍URL:http://yourdomain/sign/authz/saml20/{appid}

鐢ㄦ埛鍚嶆槧灏?```{NameID}```

## Sophon 閰嶇疆鍙婄櫥褰曢獙璇?
### 搴斺饯閰嶇疆
杩涒紛鍚庡彴"搴斺饯绠＄悊" 锛岀紪杈戝簲饨?
<img src="/doc/images/integration/jira/6.png"  />

杩涘叆"SAML閰嶇疆",閰嶇疆濡備笅
<img src="/doc/images/integration/jira/7.png"  />

### 搴斺饯璁块棶璧嬫潈
濡傛灉涓嶅湪璇ュ垪琛ㄥ唴锛屽彲浠モ€滄柊澧炴垚鍛樷€?

### 鍗曠偣鐧诲綍楠岃瘉
閲嶆柊鐧诲綍Sophon锛岀偣鍑烩€淛ira鈥濆浘鏍囧崟鐐圭櫥褰
