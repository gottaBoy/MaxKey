---
sidebar_position: 1
---

# OAuth2搴旂敤闆嗘垚
鏈枃浠嬬粛OAuth2搴旂敤濡備綍涓嶮axKey杩涜闆嗘垚銆?

## 璁よ瘉娴佺▼
閲囩敤Authorization Code鑾峰彇Access Token鐨勬巿鏉冮獙璇佹祦绋嬪張琚О涓篧eb Server Flow锛岄€傜敤浜庢墍鏈塖erver绔殑搴旂敤銆傚叾璋冪敤娴佺▼绀烘剰鍥惧涓嬶細
![sso_oauth](/images/sso/sso_oauth.png)


瀵逛簬搴旂敤鑰岃█锛屽叾娴佺▼鐢辫幏鍙朅uthorization Code鍜岄€氳繃Authorization Code鑾峰彇Access Token杩?姝ョ粍鎴愩€?

1.寮曞闇€瑕佹巿鏉冪殑鐢ㄦ埛鍒板涓嬪湴鍧€锛?

```   
http://sso.Sophon.top/sign/authz/oauth/v20/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REGISTERED_REDIRECT_URI 
```   

2.椤甸潰璺宠浆鑷?

```   
YOUR_REGISTERED_REDIRECT_URI/?code=CODE
```   

3.鎹㈠彇Access Token

```   
http://sso.Sophon.top/sign/authz/oauth/v20/token?client_id=YOUR_CLIENT_ID&client_secret=YOUR _SECRET&grant_type=authorization_code&redirect_uri=YOUR_REGISTERED_REDIRECT_URI&code=CODE
```   

杩斿洖鍊?

```     
{ "access_token":"SlAV32hkKG", "remind_in ":3600, "expires_in":3600 }
```

## 搴旂敤娉ㄥ唽
搴旂敤鍦∕axKey绠＄悊绯荤粺杩涜娉ㄥ唽锛屾敞鍐岀殑閰嶇疆淇℃伅濡備笅

![sso_oauth_conf](/images/sso/sso_oauth_conf.png)


## API鎺ュ彛鏍囧噯
   
 <table border="0" class="table table-striped table-bordered ">
		 <tr>
			<th> <strong>鎺ュ彛 </strong> </th>
			<th> <strong>璇存槑 </strong> </th>
			<th> <strong>璇︾粏璇存槑 </strong> </th>
			<th> <strong>璋冪敤鏂规硶 </strong> </th>
		  </tr>
		  <tr>
			<td> /authz/oauth/v20/authorize </td>
			<td> 璇锋眰鐢ㄦ埛鎺堟潈Token </td>
			<td> http://sso.Sophon.top/sign鎺ユ敹app sso璁よ瘉璇锋眰,<br/>client_id涓洪渶瑕佽璇佺殑搴旂敤鐨刬d;</td>
			<td> APP </td>
		  </tr>
		  <tr>
			<td> /authz/oauth/v20/token </td>
			<td> 鑾峰彇鎺堟潈杩囩殑 Access Token </td>
			<td> 鍚庡彴搴旂敤鑾峰彇 tokencode 锛岃皟鐢ㄦ帴鍙ｈ繘琛?tokencode 鏍￠獙锛?br/>鏍￠獙鎴愬姛鑾峰彇璁块棶 token </td>
			<td> APP </td>
		  </tr>
		  <tr>
			<td> /api/oauth/v20/me </td>
			<td> 鎺堟潈鐢ㄦ埛淇℃伅鏌ヨ鎺ュ彛 </td>
			<td> 閫氳繃璁块棶 token 鑾峰彇鐧诲綍鐢ㄦ埛淇℃伅 </td>
			<td> APP </td>
		  </tr>		  
 </table>
 

### 鎺堟潈鎺ュ彛

/authz/oauth/v20/authorize

璇锋眰鐢ㄦ埛鎺堟潈Token

<table border="0" class="table table-striped table-bordered ">
   <tr>
	<th> 鎺ュ彛鍚嶇О </th>
	<th> 璇锋眰鐢ㄦ埛鎺堟潈Token </th>
  </tr>
  <tr>
	<td> url </td>
	<td> http://sso.Sophon.top/sign/authz/oauth/v20/authorize</td>
  </tr>
  <tr>
	<td> 璇锋眰鏂瑰紡 </td>
	<td> http get/post </td>
  </tr>
 </table>
 	 
<h5>璇锋眰鍙傛暟</h5>

 <table border="0" class="table table-striped table-bordered ">
   <tr>
	<th>鍙傛暟 </th>
	<th> 璇存槑 </th>
  </tr>
  <tr>
	<td> client_id </td>
	<td> 娉ㄥ唽搴旂敤鏃跺垎閰嶇殑client_id銆?</td>
  </tr>

   <tr>
	<td> redirect_uri </td>
	<td>搴旂敤鍥炶皟鍦板潃锛屾敞鍐屾椂闇€瑕侀厤缃?/td>
  </tr>
  <tr>
	<td>grant_type</td>
	<td>鎺堟潈绫诲瀷銆?/td>
  </tr>
   <tr>
	<td>etc param</td>
	<td>鍏朵粬鍙傛暟銆?/td>
  </tr>
  
  <tr>
		<td colspan="2" align="left">
		鍝嶅簲杩斿洖app搴旂敤绋嬪簭锛屽寘鍚姹傚弬鏁板涓嬶細
		</td>
  </tr>
  <tr>
		<td colspan="2" align="left">
		http://app.Sophon.org/app/callback?tokencode =PQ7q7W91a-oMsCeLvIaQm6bTrgtp7
		</td>
  
  </tr>
  <tr>
		<td>tokencode</td>
		<td>鐢ㄤ簬璋冪敤/authz/oauth/token锛屾帴鍙ｈ幏鍙栨巿鏉冨悗鐨勮闂畉oken銆?/td>
  </tr>
 </table> 	

### 浠ょ墝鎺ュ彛
/authz/oauth/v20/token

閫氳繃/authz/oauth/v20/token鐢╰okencode鎹㈠彇璁块棶token

 <table border="0" class="table table-striped table-bordered ">
   <tr>
	<th> 鎺ュ彛鍚嶇О </th>
	<th> token 鎺ュ彛 </th>
  </tr>
  <tr>
	<td> url </td>
	<td> http://sso.Sophon.top/sign/authz/oauth/v20/token </td>
  </tr>
  <tr>
	<td> 璇锋眰鏂瑰紡 </td>
	<td> http get/post </td>
  </tr>
 </table>
 	 
 <h5>璇锋眰鍙傛暟</h5>
 <table border="0" class="table table-striped table-bordered ">
   <tr>
	<th>鍙傛暟 </th>
	<th> 璇存槑 </th>
  </tr>
  <tr>
	<td> client_id </td>
	<td> 娉ㄥ唽搴旂敤鏃跺垎閰嶇殑client_id銆?</td>
  </tr>
  <tr>
	<td> client_secret </td>
	<td> 娉ㄥ唽搴旂敤鏃跺垎閰嶇殑client_secret</td>
  </tr>
   <tr>
	<td> redirect_uri </td>
	<td>搴旂敤鍥炶皟鍦板潃锛屾敞鍐屾椂闇€瑕侀厤缃?/td>
  </tr>
  <tr>
	<td>tokencode</td>
	<td>璋冪敤authz/oauth/v20/authorize鑾峰緱鐨則okencode鍊笺€?/td>
  </tr>
  <tr>
	<td>grant_type</td>
	<td>鎺堟潈绫诲瀷銆侴rant type</td>
  </tr>
  <tr>
	<td>username</td>
	<td>褰揼rant_type=password鏃讹紝姝ゅ弬鏁拌〃绀虹洿鎺ヨ璇佺敤鎴峰悕銆?/td>
  </tr>
  <tr>
	<td>password</td>
	<td>褰揼rant_type=password鏃讹紝姝ゅ弬鏁拌〃绀虹洿鎺ヨ璇佺敤鎴峰瘑鐮併€?/td>
  </tr>
  <tr>
	<td>etc param</td>
	<td>鍏朵粬鍙傛暟</td>
  </tr>
  <tr align="left">
	<td colspan="2" align="left">
瀹為檯璇锋眰濡備笅锛?

```http
The actual request might look like:
POST /authz/oauth/v20/token token HTTP/1.1
Host: sso.Sophon.org/openapi
Content-Type: application/x-www-form-urlencoded
tokencode= PQ7q7W91a-oMsCeLvIaQm6bTrgtp7&
client_id=QPKKKSADFUP876&
client_secret=client_secret&
redirect_uri=http://app.Sophon.org/app/callback
```
</td>
  </tr>
  <tr>
		<td colspan="2" align="left">
		杩斿洖鏁版嵁
		</td>
  </tr>
  <tr>
		<td colspan="2" align="left">
		A successful response to this request contains the following fields:
		</td>
  
  </tr>
  <tr>
		<td>access_token</td>
		<td>鐢ㄨtoken鑳借皟鐢⊿SO鐨凙PI</td>
  </tr>
  <tr>
		<td colspan="2">
		鎴愬姛杩斿洖JSON鏁版嵁锛屽涓嬶細

```json
{ 
	"access_token":"token_id",
	"id_token":"id_token"
}
```
</td>
  </tr>
 </table> 	

### 鐢ㄦ埛灞炴€ф帴鍙?
/api/oauth/v20/me

<table  border="0" class="table table-striped table-bordered ">
 	   <tr>
	    <th> 鎺ュ彛鍚嶇О </th>
	    <th> token 鎺ュ彛 </th>
  	  </tr>
	  <tr>
	    <td> url </td>
	    <td>http://sso.Sophon.top/sign/api/oauth/v20/me</td>
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
	"userid":"zhangs"
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



## OAuth2.0 閿欒鐮?

Sophon OAuth2.0瀹炵幇涓紝鎺堟潈鏈嶅姟鍣ㄥ湪鎺ユ敹鍒伴獙璇佹巿鏉冭姹傛椂锛屼細鎸夌収OAuth2.0鍗忚瀵规湰璇锋眰鐨勮姹傚ご閮?璇锋眰鍙傛暟杩涜妫€楠岋紝鑻ヨ姹備笉鍚堟硶鎴栭獙璇佹湭閫氳繃锛屾巿鏉冩湇鍔″櫒浼氳繑鍥炵浉搴旂殑閿欒淇℃伅锛屽寘鍚互涓嬪嚑涓弬鏁帮細

error: 閿欒鐮?

error_description: 閿欒鐨勬弿杩颁俊鎭?



閿欒淇℃伅鐨勮繑鍥炴柟寮忔湁涓ょ锛?

褰撹姹傛巿鏉僂ndpoint锛歨ttp://sso.Sophon.top/sign/authz/oauth/v20/authorize 鏃跺嚭鐜伴敊璇紝杩斿洖鏂瑰紡鏄細璺宠浆鍒皉edirect_uri,骞跺湪uri 鐨剄uery parameter涓檮甯﹂敊璇殑鎻忚堪淇℃伅銆?

褰撹姹俛ccess token endpoint:http://sso.Sophon.top/sign/authz/oauth/v20/token 鏃跺嚭鐜伴敊璇紝杩斿洖鏂瑰紡锛氳繑鍥濲SON鏂囨湰銆?

渚嬪锛?
```json
{
	"error":"unsupported_response_type",
	"error_description":"涓嶆敮鎸佺殑 ResponseType."
}
```

OAuth2.0閿欒鍝嶅簲涓殑閿欒鐮佸畾涔夊涓嬭〃鎵€绀猴細

 <table  border="0" class="table table-striped table-bordered ">
	<thead>
	  <th>缂栧彿</th><th>閿欒鐮?error)</th><th>鎻忚堪(error_description)</th>
	</thead>
	<tbody>
		<tr>
			<td>1</td>
			<td>empty_client_id</td>
			<td>鍙傛暟client_id涓虹┖</td>
		</tr>
		<tr>
			<td>2</td>
			<td>empty_client_secret</td>
			<td>鍙傛暟client_secret涓虹┖</td>
		</tr>
		 <tr>
			<td>3</td>
			<td>empty_redirect_uri</td>
			<td>鍙傛暟redirect_uri涓虹┖</td>
		</tr>
		 <tr>
			<td>4</td>
			<td>empty_response_type</td>
			<td>鍙傛暟response_type涓虹┖</td>
		</tr>
		 <tr>
			<td>5</td>
			<td>empty_code</td>
			<td>code涓虹┖</td>
		</tr>
		 <tr>
			<td>6</td>
			<td>app_unsupport_sso</td>
			<td>搴旂敤涓嶆敮鎸乻so鐧诲綍</td>
		</tr>
		 <tr>
			<td>7</td>
			<td>app_unsupport_oauth</td>
			<td>搴旂敤涓嶆敮鎸丱Auth璁よ瘉</td>
		</tr>
		 <tr>
			<td>8</td>
			<td>invalid_client_id</td>
			<td>闈炴硶鐨刢lient_id</td>
		</tr>
		 <tr>
			<td>9</td>
			<td>invalid_response_type</td>
			<td>闈炴硶鐨剅esponse_type</td>
		</tr>
		 <tr>
			<td>10</td>
			<td>invalid_scope</td>
			<td>闈炴硶鐨剆cope</td>
		</tr>
		<tr>
			<td>11</td>
			<td>invalid_grant_type</td>
			<td>闈炴硶鐨刧rant_type</td>
		</tr>
		<tr>
			<td>12</td>
			<td>redirect_uri_mismatch</td>
			<td>闈炴硶鐨剅edirect_uri</td>
		</tr>
		<tr>
			<td>13</td>
			<td>unsupported_response_type</td>
			<td>涓嶆敮鎸佷紶閫掔殑response_type</td>
		</tr>
		
		<tr>
			<td>14</td>
			<td>invalid_code</td>
			<td>闈炴硶鐨刢ode</td>
		</tr>
		<tr>
			<td>15</td>
			<td>unsupported_refresh_token</td>
			<td>涓嶆敮鎸乺efresh_token鐨勬柟寮?/td>
		</tr>
		<tr>
			<td>16</td>
			<td>access_token_exprise</td>
			<td>access_token杩囨湡</td>
		</tr>
		<tr>
			<td>17</td>
			<td>invalid_access_token</td>
			<td>闈炴硶鐨刟ccess_token</td>
		</tr>
		<tr>
			<td>18</td>
			<td>invalid_refresh_token</td>
			<td>闈炴硶鐨剅efresh_token</td>
		</tr>
		<tr>
			<td>19</td>
			<td>refresh_token_exprise</td>
			<td>refresh_token杩囨湡</td>
		</tr>
</tbody>
 </table>
 

## OAuth2瀹㈡埛绔泦鎴?


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
     .apiKey("b32834accb544ea7a9a09dcae4a36403")
     .apiSecret("E9UO53P3JH52aQAcnLP2FlLv8olKIB7u")
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
    
    <title>OAuth 2.0 SSO</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">

  </head>
  
  <body>
    <a href="<%=authorizationUrl%>&approval_prompt=auto">oauth 2.0 sso</a>
  </body>
</html>
```

### 鑾峰彇浠ょ墝鍙婄敤鎴蜂俊鎭?

```java
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page language="java" import="org.Sophon.client.oauth.oauth.*" %>
<%@ page language="java" import="org.Sophon.client.oauth.builder.*" %>
<%@ page language="java" import="org.Sophon.client.oauth.builder.api.SophonApi20" %>
<%@ page language="java" import="org.Sophon.client.oauth.model.*" %>
<%@ page language="java" import="org.Sophon.client.oauth.*" %>
<%@ page language="java" import="org.Sophon.client.oauth.domain.*" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

OAuthService service = (OAuthService)request.getSession().getAttribute("oauthv20service");
if(service == null){
	String callback="http://oauth.demo.Sophon.top:8080/demo-oauth/oauth20callback.jsp";
	service = new ServiceBuilder()
     .provider(SophonApi20.class)
     .apiKey("b32834accb544ea7a9a09dcae4a36403")
     .apiSecret("E9UO53P3JH52aQAcnLP2FlLv8olKIB7u")
     .callback(callback)
     .build();
}

Token EMPTY_TOKEN = null;
Verifier verifier = new Verifier(request.getParameter("code"));
Token accessToken = service.getAccessToken(EMPTY_TOKEN, verifier);
 
OAuthClient restClient=new OAuthClient("http://sso.Sophon.top/sign/api/oauth/v20/me");
UserInfo userInfo=restClient.getUserInfo(accessToken.getAccess_token());

%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
   <title>OAuth V2.0 Demo</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="OAuth V2.0 Demo">
	<link rel="shortcut icon" type="image/x-icon" href="<%=basePath %>/images/favicon.ico"/>
	<script type="text/javascript" src="<%=basePath %>/jquery-3.5.0.min.js"></script>
	<script type="text/javascript" src="<%=basePath %>/jsonformatter.js"></script>
	<link   type="text/css" rel="stylesheet"  href="<%=basePath %>/demo.css"/>
  </head>
  <body>
  		<div class="container">
	  		<table class="datatable">
	  			<tr>
	  				<td colspan="2" class="title">OAuth V2.0 Demo</td>
	  			</tr>
	  			<tr>
	  				<td width="50%">OAuth V2.0 Logo</td>
	  				<td width="50%"> <img src="<%=basePath %>/images/oauth-2-sm.png"  width="124px" height="124px"/></td>
	  			</tr>
	  			<tr>
	  				<td>Login</td>
	  				<td><%=userInfo.getUsername() %></td>
	  			</tr>
	  			<tr>
	  				<td>DisplayName</td>
	  				<td><%=userInfo.getDisplayName() %></td>
	  			</tr>
	  			<tr>
	  				<td>Department</td>
	  				<td><%=userInfo.getDepartment() %></td>
	  			</tr>
	  			<tr>
	  				<td>JobTitle</td>
	  				<td><%=userInfo.getJobTitle() %></td>
	  			</tr>
	  			<tr>
	  				<td>email</td>
	  				<td><%=userInfo.getEmail() %></td>
	  			</tr> 
	  			<tr>
	  				<td>ResponseString</td>
	  				<td  style="word-wrap: break-word;">
						<textarea cols="68" rows="20" v-model="text2"><%=userInfo.getResponseString() %></textarea>
					</td>
	  			</tr>
	  		</table>
			<script type="text/javascript">
				FormatTextarea();
			</script>
  		</div>
  </body>
</html>
```

## OAuth2 PASSWORD妯″紡

鏈枃浣跨敤JAVA 绋嬪簭涓轰緥

```java
package org.Sophon.client.oauth.test;

import org.Sophon.client.http.Response;
import org.Sophon.client.oauth.builder.api.SophonPasswordApi20;
import org.Sophon.client.oauth.model.OAuthConfig;
import org.Sophon.client.oauth.model.Token;
import org.Sophon.client.oauth.oauth.OAuthPasswordService;

public class SophonPasswordDemo {
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String accessTokenUrl="http://sso.Sophon.top/sign/authz/oauth/v20/token";
		String clientId = "b32834accb544ea7a9a09dcae4a36403";
		String clientSerect = "E9UO53P3JH52aQAcnLP2FlLv8olKIB7u";
		
		String callback = "http://oauth.demo.Sophon.top:8080/demo-oauth/oauth20callback.jsp";
		String responseType ="token";
		String approvalprompt = "auto";
		
		OAuthConfig oauthServiceConfig=new OAuthConfig(clientId,clientSerect,callback);
		SophonPasswordApi20	passwordApi20=new SophonPasswordApi20(accessTokenUrl);
		OAuthPasswordService oAuthPasswordService=new OAuthPasswordService(oauthServiceConfig,passwordApi20);
		Token accessToken = null;
		Response response = null;
		accessToken = oAuthPasswordService.getAccessToken("admin", "Sophon"); 
	}
}
```


### 璇︾粏瑙佽鍙傝€?

https://github.com/SophonTop/Sophon-Client-sdk/blob/master/src/test/java/org/Sophon/client/oauth/test/SophonPasswordDemo.java
