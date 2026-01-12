---
sidebar_position: 2
---
# OpenID Connect搴旂敤闆嗘垚
鏈枃浠嬬粛OpenID Connect搴旂敤濡備綍涓嶮axKey杩涜闆嗘垚銆?

## 璁よ瘉娴佺▼

璇峰弬鐓Auth2璁よ瘉娴佺▼

## 搴旂敤娉ㄥ唽
搴旂敤鍦∕axKey绠＄悊绯荤粺杩涜娉ㄥ唽锛屾敞鍐岀殑閰嶇疆淇℃伅濡備笅

![sso_oidc_conf](/images/sso/sso_oidc_conf.png)


## 闆嗘垚鍜屾帴鍙?
鐢ㄦ埛灞炴€ф帴鍙?api/connect/v10/userinfo

閫氳繃璁块棶token 鑾峰彇鐧诲綍鐢ㄦ埛淇℃伅鍙婄鍚嶄俊鎭紝鍦ㄧ▼搴忎腑蹇呴』楠岃瘉鐩稿叧鐨勭鍚嶄俊鎭€?
 
<table  border="0" class="table table-striped table-bordered ">
 	   <tr>
	    <th> 鎺ュ彛鍚嶇О </th>
	    <th> OIDC鎺堟潈鐢ㄦ埛淇℃伅鏌ヨ鎺ュ彛 </th>
  	  </tr>
	  <tr>
	    <td> url </td>
	    <td>https://sso.Sophon.org/Sophon/api/connect/v10/userinfo</td>
	  </tr>
	  <tr>
	    <td> 璇锋眰鏂瑰紡 </td>
	    <td> http get/post </td>
	  </tr>
</table>
 	 
<h5>璇锋眰鍙傛暟</h5>

<table  border="0" class="table table-striped table-bordered ">
 	   <tr>
	    <th>鍙傛暟 </th>
	    <th> 璇存槑 </th>
  	  </tr>
	  <tr>
	    <td> access_token </td>
	    <td> 璋冪敤sso/ token鑾峰緱鐨則oken鍊笺€?</td>
	  </tr>
	  <tr align="left">
	  	<td colspan="2" align="left">
	  				瀹為檯璇锋眰濡備笅锛?

```http
POST /oauth/ userinfo HTTP/1.1
Host: sso.Sophon.org/openapi
Content-Type: application/x-www-form-urlencoded
access_token= PQ7q7W91a-oMsCeLvIaQm6bTrgtp7
```
</td>
	  </tr>
	  <tr>
	  		<td colspan="2" align="left">
	  		杩斿洖鏁版嵁/ response data
	  		</td>
	  </tr>
	  <tr>
	  		<td colspan="2">
	  		<p>鎴愬姛杩斿洖JSON鏁版嵁锛屽涓嬶細</p>

```json
{
	userid     :  "zhangs"
}
```

<br/>
zhangs鏄璇佺殑鐢ㄦ埛ID
	  		</td>
	  </tr>
 	 </table> 	



OAuth璁よ瘉鎺ュ彛灞炴€у垪琛?

<table   border="0" class="table table-striped table-bordered ">
   <tr >
	<th> 灞炴€у悕(Attribute) </th>
	<th> 鎻忚堪 </th>
	<th>鏁版嵁绫诲瀷</th>
  </tr>
  <tr>
	<td>uid</td>
	<td>uid</td>
	<td>瀛楃涓?/td>
  </tr>
 </table> 	

鍏朵粬璇峰弬鐓Auth2


## OIDC V1瀹㈡埛绔泦鎴?

鏈枃浣跨敤JAVA WEB绋嬪簭涓轰緥

### 寮曞叆渚濊禆鍖?

```java
gson-2.2.4.jar
Sophon-client-sdk.jar
nimbus-jose-jwt-8.10.jar
commons-codec-1.9.jar
commons-io-2.2.jar
commons-logging-1.1.1.jar
```

### 璁よ瘉鎺堟潈

```java
<%@ page language="java" import="java.util.*" pageEncoding="ISO-8859-1"%>
<%@ page language="java" import="org.Sophon.client.oauth.oauth.*" %>
<%@ page language="java" import="org.Sophon.client.oauth.builder.*" %>
<%@ page language="java" import="org.Sophon.client.oauth.builder.api.SophonApi20" %>
<%@ page language="java" import="org.Sophon.client.oauth.model.Token" %>

<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+path+"/";

String callback="http://oauth.demo.Sophon.top:8080/demo-oauth/oauth20callback.jsp";
OAuthService service = new ServiceBuilder()
                            .provider(SophonApi20.class)
                            .apiKey("ae20330a-ef0b-4dad-9f10-d5e3485ca2ad")
                            .apiSecret("KQY4MDUwNjIwMjAxNTE3NTM1OTEYty")
                            .callback(callback)
                            .build();
Token EMPTY_TOKEN = null;
String authorizationUrl = service.getAuthorizationUrl(EMPTY_TOKEN);

request.getSession().setAttribute("oauthv20service", service);

%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>OIDC V1 SSO</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
  </head>
  
  <body>
    <a href="<%=authorizationUrl%>&approval_prompt=auto">OIDC V1 SSO</a>
  </body>
</html>

```


### 鐧诲綍楠岃瘉

鑾峰彇浠ょ墝銆佺敤鎴蜂俊鎭強楠岃瘉绛惧悕 (id_token鍙婄敤鎴蜂俊鎭?

```java
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page language="java" import="org.Sophon.client.oauth.oauth.*" %>
<%@ page language="java" import="org.Sophon.client.oauth.builder.*" %>
<%@ page language="java" import="org.Sophon.client.oauth.builder.api.SophonApi20" %>
<%@ page language="java" import="org.Sophon.client.oauth.model.*" %>
<%@ page language="java" import="org.Sophon.client.oauth.*" %>
<%@ page language="java" import="org.Sophon.client.oauth.domain.*" %>
<%@ page language="java" import="org.Sophon.client.utils.*" %>
<%@ page language="java" import="com.nimbusds.jwt.JWTClaimsSet" %>
<%@ page language="java" import="com.nimbusds.jose.*" %>
<%@ page language="java" import="com.nimbusds.jwt.*" %>
<%@ page language="java" import="com.connsec.oidc.jose.keystore.*" %>
<%@ page language="java" import="com.nimbusds.jose.jwk.*" %>
<%@ page language="java" import="java.io.File" %>
<%@ page language="java" import="com.nimbusds.jose.crypto.*" %>
<%@ page language="java" import="com.google.gson.*" %>

<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

OAuthService service = (OAuthService)request.getSession().getAttribute("oauthv20service");

if(service==null){
	String callback="http://oauth.demo.Sophon.top:8080/demo-oauth/oidc10callback.jsp";
	service = new ServiceBuilder()
     .provider(SophonApi20.class)
     .apiKey("ae20330a-ef0b-4dad-9f10-d5e3485ca2ad")
     .apiSecret("KQY4MDUwNjIwMjAxNTE3NTM1OTEYty")
     .callback(callback)
     .build();
}

Token EMPTY_TOKEN = null;
Verifier verifier = new Verifier(request.getParameter("code"));
Token accessToken = service.getAccessToken(EMPTY_TOKEN, verifier);

//JWTClaimsSet idClaims = JWTClaimsSet.parse(accessToken.getId_token());
SignedJWT signedJWT=null;

//JWKSetKeyStore jwkSetKeyStore=new JWKSetKeyStore();

File jwksFile=new File(PathUtils.getInstance().getClassPath()+"jwk.jwks");
JWKSet jwkSet=JWKSet.load(jwksFile);

RSASSAVerifier rsaSSAVerifier = new RSASSAVerifier(((RSAKey) jwkSet.getKeyByKeyId("Sophon_rsa")).toRSAPublicKey());
try {
    signedJWT = SignedJWT.parse(accessToken.getId_token());
} catch (java.text.ParseException e) {
    // Invalid signed JWT encoding
}
;

OAuthClient restClient=new OAuthClient("http://sso.Sophon.top/sign/api/connect/v10/userinfo",accessToken.getToken());
 
OIDCUserInfo userInfo=restClient.getOIDCUserInfo(accessToken.getToken());
 
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">

   <title>OpenID Connect 1.0 Demo</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="OpenID Connect 1.0 Demo">
	<link rel="shortcut icon" type="image/x-icon" href="<%=basePath %>/images/favicon.ico"/>
	<script type="text/javascript" src="<%=basePath %>/jquery-3.5.0.min.js"></script>
	<script type="text/javascript" src="<%=basePath %>/jsonformatter.js"></script>
	<link   type="text/css" rel="stylesheet"  href="<%=basePath %>/demo.css"/>

  </head>
  
  <body>
  		<div class="container">
	  		<table class="datatable">
	  			<tr>
	  				
	  				<td colspan="2" class="title">OpenID Connect 1.0 Demo</td>
	  			</tr>
	  			
	  			<tr>
	  				<td>OpenID Connect 1.0 Logo</td>
	  				<td> <img src="<%=basePath %>/images/openid.png"  width="124px" height="124px"/></td>
	  			</tr>
	  			<tr>
	  				<td>Login</td>
	  				<td><%=userInfo.getSub() %></td>
	  			</tr>
	  			<tr>
	  				<td>DisplayName</td>
	  				<td><%=userInfo.getName()%></td>
	  			</tr>
	  			<tr>
	  				<td>Department</td>
	  				<td><%=userInfo.getGender() %></td>
	  			</tr>
	  			
	  			<tr>
	  				<td>email</td>
	  				<td><%=userInfo.getEmail() %></td>
	  			</tr>
	  			<tr>
	  				<td>ResponseString</td>
	  				<td style="word-wrap: break-word;">
						<textarea cols="68" rows="20" v-model="text2"><%=userInfo.getResponseString() %></textarea>
					</td>
	  			</tr>
	  			<tr>
	  				<td>Id_token</td>
	  				<td style="word-wrap: break-word;"><%=accessToken.getId_token() %></td>
	  			</tr>
				<tr>
	  				<td>Verify</td>
	  				<td style="word-wrap: break-word;"><%=signedJWT.verify(rsaSSAVerifier) %></td>
	  			</tr>
	  			<tr>
	  				<td>Issuer</td>
	  				<td style="word-wrap: break-word;"><%=signedJWT.getJWTClaimsSet().getIssuer() %></td>
	  			</tr>
	  			<tr>
	  				<td>JWTClaims</td>
	  				<td style="word-wrap: break-word;">
						<textarea cols="68" rows="20" v-model="text2"><%=signedJWT.getPayload() %></textarea>
					</td>
	  			</tr>
	  			
	  		</table>
  		</div> 
		<script type="text/javascript">
			FormatTextarea();
		</script>
  </body>
</html>

```

