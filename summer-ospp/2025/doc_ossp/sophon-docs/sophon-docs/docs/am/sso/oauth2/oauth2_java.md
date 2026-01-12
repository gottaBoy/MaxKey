---
sidebar_position: 2
title: OAuth2 Java瀹㈡埛绔泦鎴?
---

## OAuth2 Java瀹㈡埛绔泦鎴?


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
