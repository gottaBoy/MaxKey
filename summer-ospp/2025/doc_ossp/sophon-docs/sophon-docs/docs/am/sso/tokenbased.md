---
sidebar_position: 6
---

# TokenBased鍗忚闆嗘垚
鏈枃浠嬬粛TokenBased鍗忚濡備綍涓嶮axKey杩涜闆嗘垚銆?

## 搴旂敤娉ㄥ唽

搴旂敤鍦∕axKey绠＄悊绯荤粺杩涜娉ㄥ唽锛屾敞鍐岀殑閰嶇疆淇℃伅濡備笅

![sso_token_conf](/images/sso/sso_token_conf.png)

LTPA浣跨敤Cookie浼犺緭浠ょ墝

![sso_token_ltpa_conf](/images/sso/sso_token_ltpa_conf.png)


## TokenBased瀹㈡埛绔泦鎴?

鏈枃浣跨敤JAVA WEB绋嬪簭涓轰緥

### 寮曞叆瀹㈡埛绔墍闇€鍖?

```ini
gson-2.2.4.jar
Sophon-client-sdk.jar
nimbus-jose-jwt-8.10.jar
commons-codec-1.9.jar
commons-io-2.2.jar
commons-logging-1.1.1.jar
```

### 绠€鍗曚护鐗?

```java
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page language="java" import="org.Sophon.client.tokenbase.*"%>
<%@ page language="java" import="org.Sophon.client.crypto.*"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String token =request.getParameter("token");
System.out.println("token : "+token);
String tokenString=TokenUtils.decode(token, "x8zPbCya", ReciprocalUtils.Algorithm.DES);
String parseToken[]=TokenUtils.parseSimpleBasedToken(tokenString);
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
   <title>SimpleBasedToken Demo</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="SimpleBasedToken Demo">
	<link rel="shortcut icon" type="image/x-icon" href="<%=basePath %>/images/favicon.ico"/>
	<link   type="text/css" rel="stylesheet"  href="<%=basePath %>/demo.css"/>
	
  </head>
  
  <body>
  		<div class="container">
	  		<table class="datatable">
	  			<tr>
	  				
	  				<td colspan="2" class="title">SimpleBasedToken Demo</td>
	  			</tr>
	  			
	  			<tr>
	  				<td>SimpleBasedToken Logo</td>
	  				<td> <img src="<%=basePath %>images/simple.png" width="124px" height="124px"/></td>
	  			</tr>
	  			<tr>
	  				<td>UserName</td>
	  				<td><%=parseToken[0]%></td>
	  			</tr>
	  			<tr>
	  				<td>Authentication at Time</td>
	  				<td><%=parseToken[1]%></td>
	  			</tr>
	  		</table>
  		</div>
  </body>
</html>
```

### 鍩轰簬JSON浠ょ墝

```java
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page language="java" import="org.Sophon.client.tokenbase.*"%>
<%@ page language="java" import="org.Sophon.client.crypto.*"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String token =request.getParameter("token");
System.out.println("token : "+token);
String tokenString=TokenUtils.decode(token, "lEWhDLTo", ReciprocalUtils.Algorithm.DES);
Map tokenMap=TokenUtils.parseJsonBasedToken(tokenString);

%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
   <title>JsonBasedToken Demo</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="JsonBasedToken Demo">
	<link rel="shortcut icon" type="image/x-icon" href="<%=basePath %>/images/favicon.ico"/>
	<link   type="text/css" rel="stylesheet"  href="<%=basePath %>/demo.css"/>
	
  </head>
  
  <body>
  		<div class="container">
	  		<table class="datatable">
	  			<tr>
	  				
	  				<td colspan="2" class="title">JsonBasedToken Demo</td>
	  			</tr>
	  			
	  			<tr>
	  				<td>JsonBasedToken Logo</td>
	  				<td> <img src="<%=basePath %>images/json.png" width="124px" height="124px"/></td>
	  			</tr>
	  			<tr>
	  				<td>UID</td>
	  				<td><%=tokenMap.get("uid") %></td>
	  			</tr>
	  			<tr>
	  				<td>UserName</td>
	  				<td><%=tokenMap.get("username") %></td>
	  			</tr>
	  			<tr>
	  				<td>Department</td>
	  				<td><%=tokenMap.get("department") %></td>
	  			</tr>
	  			<tr>
	  				<td>Email</td>
	  				<td><%=tokenMap.get("email") %></td>
	  			</tr>
	  			<tr>
	  				<td>Authentication at Time</td>
	  				<td><%=tokenMap.get("at")%></td>
	  			</tr>
	  			<tr>
	  				<td>Expires</td>
	  				<td><%=tokenMap.get("expires")%></td>
	  			</tr>
	  		</table>
  		</div>
  </body>
</html>
```

### 鍩轰簬LTPA JSON(COOKIE JSON)浠ょ墝

```java
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page language="java" import="org.Sophon.client.ltpa.*"%>
<%@ page language="java" import="org.Sophon.client.crypto.*"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String ltpaVaule=LtpaUtils.readLtpa(request, "Sophon.top", "ltpa");
System.out.println("============ ltpaVaule "+ltpaVaule);
Map tokenMap=null;
if(ltpaVaule!=null){
	String ltpaString=LtpaUtils.decode(ltpaVaule, "k1tk41Ng", ReciprocalUtils.Algorithm.DES);
	tokenMap=LtpaUtils.parseLtpaJson(ltpaString);
}
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
   <title>LTPA Demo</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="LTPA Demo">
	<link rel="shortcut icon" type="image/x-icon" href="<%=basePath %>/images/favicon.ico"/>
	<link   type="text/css" rel="stylesheet"  href="<%=basePath %>/demo.css"/>
	
  </head>
  
  <body>
  		<div class="container">
	  		<table class="datatable">
	  			<tr>
	  				
	  				<td colspan="2" class="title">LTPA Demo</td>
	  			</tr>
	  			
	  			<tr>
	  				<td>LTPA Logo</td>
	  				<td> <img src="<%=basePath %>images/ltpa.png" width="124px" height="124px"/></td>
	  			</tr>
	  			<tr>
	  				<td>UID</td>
	  				<td><%=tokenMap.get("uid") %></td>
	  			</tr>
	  			<tr>
	  				<td>UserName</td>
	  				<td><%=tokenMap.get("username") %></td>
	  			</tr>
	  			<tr>
	  				<td>Department</td>
	  				<td><%=tokenMap.get("department") %></td>
	  			</tr>
	  			<tr>
	  				<td>Email</td>
	  				<td><%=tokenMap.get("email") %></td>
	  			</tr>
	  			<tr>
	  				<td>Authentication at Time</td>
	  				<td><%=tokenMap.get("at")%></td>
	  			</tr>
	  			<tr>
	  				<td>Expires</td>
	  				<td><%=tokenMap.get("expires")%></td>
	  			</tr>
	  		</table>
  		</div>
  </body>
</html>

```
