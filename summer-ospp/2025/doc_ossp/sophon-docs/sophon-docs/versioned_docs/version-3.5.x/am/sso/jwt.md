---
sidebar_position: 4
---
# JWT搴旂敤闆嗘垚 
鏈枃浠嬬粛JWT搴旂敤濡備綍涓嶮axKey杩涜闆嗘垚銆?

## 搴旂敤娉ㄥ唽

搴旂敤鍦∕axKey绠＄悊绯荤粺杩涜娉ㄥ唽锛屾敞鍐岀殑閰嶇疆淇℃伅濡備笅

![sso_jwt_conf](/images/sso/sso_jwt_conf.png)


## JWT瀹㈡埛绔泦鎴?

鏈枃浣跨敤JAVA WEB绋嬪簭涓轰緥

### 寮曞叆瀹㈡埛绔墍闇€鍖?

```java
gson-2.2.4.jar
Sophon-client-sdk.jar
nimbus-jose-jwt-8.10.jar
commons-codec-1.9.jar
commons-io-2.2.jar
commons-logging-1.1.1.jar
```


### 鑾峰彇浠ょ墝鍜岀敤鎴蜂俊鎭強楠岃瘉绛惧悕

```java
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page language="java" import="org.Sophon.client.oauth.model.*" %>
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
String token=request.getParameter("jwt");
System.out.println("jwt "+token);
SignedJWT signedJWT=null;
File jwksFile=new File(PathUtils.getInstance().getClassPath()+"jwk.jwks");
JWKSet jwkSet=JWKSet.load(jwksFile);
RSASSAVerifier rsaSSAVerifier = new RSASSAVerifier(((RSAKey) jwkSet.getKeyByKeyId("Sophon_rsa")).toRSAPublicKey());
try {
    signedJWT = SignedJWT.parse(token);
} catch (java.text.ParseException e) {
    // Invalid signed JWT encoding
}
System.out.println("signedJWT "+signedJWT);
JWTClaimsSet jwtClaims =signedJWT.getJWTClaimsSet();
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
   <title>JWT 1.0 Demo</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="JWT 1.0 Demo">
	<link rel="shortcut icon" type="image/x-icon" href="<%=basePath %>/images/favicon.ico"/>
	<script type="text/javascript" src="<%=basePath %>/jquery-3.5.0.min.js"></script>
	<script type="text/javascript" src="<%=basePath %>/jsonformatter.js"></script>
	<link   type="text/css" rel="stylesheet"  href="<%=basePath %>/demo.css"/>	
  </head>
  <body>
  		<div class="container">
	  		<table class="datatable">
	  			<tr>
	  				<td colspan="2" class="title">JSON Web Token (JWT) 1.0 Demo</td>
	  			</tr>
	  			<tr>
	  				<td>JWT 1.0 Logo</td>
	  				<td> <img src="<%=basePath %>/images/jwt.png"  width="124px" height="124px"/></td>
	  			</tr>
	  			<tr>
	  				<td>Issuer</td>
	  				<td><%=jwtClaims.getIssuer() %></td>
	  			</tr>
	  			<tr>
	  				<td>Subject</td>
	  				<td><%=jwtClaims.getSubject()%></td>
	  			</tr>
	  			<tr>
	  				<td>Audience</td>
	  				<td><%=jwtClaims.getAudience() %></td>
	  			</tr>
	  			<tr>
	  				<td>ExpirationTime</td>
	  				<td><%=jwtClaims.getExpirationTime() %></td>
	  			</tr>
	  			<tr>
	  				<td>JWTID</td>
	  				<td style="word-wrap: break-word;"><%=jwtClaims.getJWTID() %></td>
	  			</tr>
	  			<tr>
	  				<td>IssueTime</td>
	  				<td style="word-wrap: break-word;"><%=jwtClaims.getIssueTime() %></td>
	  			</tr>
				<tr>
	  				<td>Verify</td>
	  				<td style="word-wrap: break-word;"><%=signedJWT.verify(rsaSSAVerifier) %></td>
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


## PHP瀹㈡埛绔泦鎴?

### 寮曞叆渚濊禆firebase/php-jwt

```php
composer require firebase/php-jwt
```

### 楠岃瘉绛惧悕

```php
<?php
require 'vendor/autoload.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

$publicKey = <<<EOD
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvyfZwQuBLNvJDhmziUCF
uAfIv+bC6ivodcR6PfanTt8XLd6G63Yx10YChAdsDACjoLz1tEU56WPp/ee/vcTS
sEZT3ouWJYghuGI2j4XclXlEj0S7DzdpcBBpI4n5dr8K3iKY+3JUMZR1AMBHI50U
aMST9ZTZJAjUPIYxkhRdca5lWBo4wGUh1yj/80+Bq6al0ia9S5NTzNLaJ18jSxFq
Z79BAkBm+KjkP248YUk6WBGtYEAV5Fws4dpse4hrqJ3RRHiMZV1o1iTmPHz/l55Z
SDP3vpYf6iKqKzoK2RmdjfH5mGpbc4+PclTs4GKfwZ7cWfrny6B7sMnQfzujCH99
6QIDAQAB
-----END PUBLIC KEY-----
EOD;

$jwt = $_POST["jwt"];
echo "jwt:\n" .$jwt. "\n";

$decoded = JWT::decode($jwt, new Key($publicKey, 'RS256'));

/*
 * NOTE: This will now be an object instead of an associative array. 
 *	   To get an associative array, you will need to cast it as such:
 */
$decoded_array = (array) $decoded;
echo "Decode:\n" . print_r($decoded_array, true) . "\n";
?>
```
