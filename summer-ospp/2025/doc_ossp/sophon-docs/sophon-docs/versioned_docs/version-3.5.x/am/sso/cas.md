---
sidebar_position: 3
---
# CAS搴旂敤闆嗘垚
鏈枃浠嬬粛CAS搴旂敤濡備綍涓嶮axKey杩涜闆嗘垚銆?

## 搴旂敤娉ㄥ唽

搴旂敤鍦∕axKey绠＄悊绯荤粺杩涜娉ㄥ唽锛屾敞鍐岀殑閰嶇疆淇℃伅濡備笅
![sso_cas_conf](/images/sso/sso_cas_conf.png)


## CAS瀹㈡埛绔厤缃?

鏈枃浣跨敤JAVA WEB绋嬪簭涓轰緥

婧愪唬鐮佸湴鍧€

https://github.com/SophonTop/Sophon-Demo/blob/master/Sophon-demo-cas


### 寮曞叆渚濊禆鍖?

jar鍖呬緷璧栧涓?

```java
cas-client-core-3.2.1.jar
commons-codec-1.9.jar
commons-io-2.2.jar
commons-logging-1.1.1.jar
```


### web.xml閰嶇疆
```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app>
	<display-name></display-name>
	<listener>
		<listener-class>org.jasig.cas.client.session.SingleSignOutHttpSessionListener</listener-class>
	</listener>
	<filter>
		<filter-name>CAS Single Sign Out Filter</filter-name>
		<filter-class>org.jasig.cas.client.session.SingleSignOutFilter</filter-class>
	</filter>
	<filter-mapping>
		<filter-name>CAS Single Sign Out Filter</filter-name>
		<url-pattern>/index.jsp</url-pattern>
	</filter-mapping>
	<filter>
		<filter-name>CAS Filter</filter-name>
		<filter-class>org.jasig.cas.client.authentication.AuthenticationFilter</filter-class>
		<!-- cas server login url -->
		<init-param>
			<param-name>casServerLoginUrl</param-name>
			<param-value>http://sso.Sophon.top/sign/authz/cas/login</param-value>
		</init-param>
		<!-- cas client url, in end of url / is required -->
		<init-param>
			<param-name>serverName</param-name>
			<param-value>http://cas.demo.Sophon.top:8080/</param-value>
		</init-param>
	</filter>
	<filter-mapping>
		<filter-name>CAS Filter</filter-name>
		<url-pattern>/index.jsp</url-pattern>
	</filter-mapping>
	<!-- Cas10TicketValidationFilter Cas20ProxyReceivingTicketValidationFilter -->
	<filter>
		<filter-name>CAS Validation Filter</filter-name>
		<filter-class>org.jasig.cas.client.validation.Cas20ProxyReceivingTicketValidationFilter</filter-class>
		<!-- cas server Validation url -->
		<init-param>
			<param-name>casServerUrlPrefix</param-name>
			<param-value>http://sso.Sophon.top/sign/authz/cas/</param-value>
		</init-param>
		<!-- cas client url -->
		<init-param>
			<param-name>serverName</param-name>
			<param-value>http://cas.demo.Sophon.top:8080/</param-value>
		</init-param>
	</filter>
	<filter-mapping>
		<filter-name>CAS Validation Filter</filter-name>
		<url-pattern>/index.jsp</url-pattern>
	</filter-mapping>
	<filter>
		<filter-name>CAS HttpServletRequest Wrapper Filter</filter-name>
		<filter-class>
			org.jasig.cas.client.util.HttpServletRequestWrapperFilter
		</filter-class>
	</filter>
	<filter-mapping>
		<filter-name>CAS HttpServletRequest Wrapper Filter</filter-name>
		<url-pattern>/index.jsp</url-pattern>
	</filter-mapping>
	<filter>
		<filter-name>CAS Assertion Thread Local Filter</filter-name>
		<filter-class>org.jasig.cas.client.util.AssertionThreadLocalFilter</filter-class>
	</filter>
	<filter-mapping>
		<filter-name>CAS Assertion Thread Local Filter</filter-name>
		<url-pattern>/index.jsp</url-pattern>
	</filter-mapping>
	<welcome-file-list>
		<welcome-file>index.jsp</welcome-file>
	</welcome-file-list>
</web-app>
```

### 鑾峰彇鐧诲綍鍚嶅強鐢ㄦ埛灞炴€?

```java
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page language="java" import="java.util.Map.Entry" %>
<%@ page language="java" import="org.apache.commons.codec.binary.Base64" %>
<%@ page language="java" import="org.jasig.cas.client.authentication.AttributePrincipal" %>
<%@ page language="java" import="org.jasig.cas.client.validation.Assertion" %>
<%@ page language="java" import="org.jasig.cas.client.util.AbstractCasFilter" %>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
	System.out.println("CAS Assertion Success . ");
	Assertion assertion = (Assertion) request.getSession().getAttribute(AbstractCasFilter.CONST_CAS_ASSERTION);
	String username=     assertion.getPrincipal().getName();
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>Demo CAS</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="CAS Demo">
	<link rel="shortcut icon" type="image/x-icon" href="<%=basePath %>/images/favicon.ico"/>
	<style type="text/css">
		body{
			margin: 0;
			margin-top: 0px;
			margin-left: auto;
			margin-right: auto;
			padding: 0 0 0 0px;
			font-size: 12px;
			text-align:center;
			float:center;
			font-family: "Arial", "Helvetica", "Verdana", "sans-serif";
		}
		.container {
			width: 990px;
			margin-left: auto;
			margin-right: auto;
			padding: 0 10px
		}
		table.datatable {
			border: 1px solid #d8dcdf;
			border-collapse:collapse;
			border-spacing:0;
			width: 100%;
		}
		
		table.datatable th{
			border: 1px solid #d8dcdf;
			border-collapse:collapse;
			border-spacing:0;
			height: 40px;
		}
		
		
		table.datatable td{
			border: 1px solid #d8dcdf;
			border-collapse:collapse;
			border-spacing:0;
			height: 40px;
		}
		
		table.datatable td.title{
			text-align: center;
			font-size: 20px;
			font-weight: bold;
		}
	</style>
  </head>
  
  <body>
  		<div class="container">
	  		<table class="datatable">
	  			<tr>
	  				<td colspan="2" class="title">CAS Demo for Sophon</td>
	  			</tr>
	  			<tr>
	  				<td>CAS Logo</td>
	  				<td> <img src="<%=basePath %>/images/cas.png"/></td>
	  			</tr>
	  			<tr>
	  				<td width="50%">CAS Assertion</td>
	  				<td><%=username %></td>
	  			</tr>
	  			<tr>
	  				<td>CAS Has Attributes </td>
	  				<td><%=!assertion.getPrincipal().getAttributes().isEmpty() %> size : <%=assertion.getPrincipal().getAttributes().size() %></td>
	  			</tr>
	  			<%
		  			Map<String, Object> attMap = assertion.getPrincipal().getAttributes();  
		            for (Entry<String, Object> entry : attMap.entrySet()) {   
		            	String attributeValue=entry.getValue()==null?"":entry.getValue().toString();
		            	System.out.println("attributeValue : "+attributeValue);
		            	if(attributeValue.startsWith("base64:")){
		            		attributeValue=new String(Base64.decodeBase64(attributeValue.substring("base64:".length())),"UTF-8");
		            	}
		        %>
	  			<tr>
	  				<td>CAS <%=entry.getKey() %> </td>
	  				<td><%=attributeValue %></td>
	  			</tr>
	  			<%}%>
	  		</table>
  		</div>
  </body>
</html>
```


## SpringBoot CAS閰嶇疆

婧愪唬鐮佸湴鍧€

https://github.com/SophonTop/Sophon-SpringBoot4CAS-demo


demo鍒嗗埆鍐欎簡涓変釜璇锋眰:鎷︽埅璇锋眰 test1/index,test1/index1 浠ュ強涓嶆嫤鎴姹倀est1/index2,

### 寮曞叆渚濊禆鍖?

```xml
<dependency>
	<groupId>net.unicon.cas</groupId>
	<artifactId>cas-client-autoconfig-support</artifactId>
	<version>2.3.0-GA</version>
</dependency>
```  

### SpringBoot閰嶇疆

```
server:
  port: 8989
cas:
  # cas鏈嶅姟绔湴鍧€
  server-url-prefix: http://sso.Sophon.top/sign/authz/cas/
  # cas鏈嶅姟绔櫥闄嗗湴鍧€
  server-login-url: http://sso.Sophon.top/sign/authz/cas/login
  # 瀹㈡埛绔闂湴鍧€
  client-host-url: http://localhost:8989/
  # 璁よ瘉鏂瑰紡锛岄粯璁as
  validation-type: cas
  #  瀹㈡埛绔渶瑕佹嫤鎴殑URL鍦板潃
  authentication-url-patterns:
    - /test1/index
    - /test1/index1
```	

鎵╁睍閰嶇疆椤?
```
cas.authentication-url-patterns
cas.validation-url-patterns
cas.request-wrapper-url-patterns
cas.assertion-thread-local-url-patterns
cas.gateway
cas.use-session
cas.redirect-after-validation
cas.allowed-proxy-chains
cas.proxy-callback-url
cas.proxy-receptor-url
cas.accept-any-proxy
server.context-parameters.renew
```

### CAS娉ㄨВ
鍦╝pplication鍚姩绫讳笂鍔犱笂 @EnableCasClient 娉ㄨВ

```java
@SpringBootApplication
@EnableCasClient
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

}
```

### 鑾峰彇鐧诲綍鐢ㄦ埛淇℃伅

```java
    @GetMapping("test1/index1")
    public String index1(HttpServletRequest request){
        String token =request.getParameter("token");
        System.out.println("token : "+token);
        Assertion assertion = (Assertion) request.getSession().getAttribute(AbstractCasFilter.CONST_CAS_ASSERTION);

        String username=     assertion.getPrincipal().getName();
        System.out.println(username);

        return "test index cas鎷︽埅姝ｅ父,鐧诲綍璐﹀彿:"+username;
    }
```

## CAS REST鐧诲綍 

```java
package org.Sophon.web.authorize.endpoint;

import org.pac4j.cas.profile.CasRestProfile;
import org.pac4j.cas.client.rest.CasRestFormClient;
import org.pac4j.cas.config.CasConfiguration;
import org.pac4j.cas.credentials.authenticator.CasRestAuthenticator;
import org.pac4j.cas.profile.CasProfile;
import org.pac4j.core.context.J2EContext;
import org.pac4j.core.context.WebContext;
import org.pac4j.core.credentials.TokenCredentials;
import org.pac4j.core.credentials.UsernamePasswordCredentials;
import org.pac4j.core.exception.HttpAction;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.util.Map;
import java.util.Set;

//https://apereo.github.io/cas/6.0.x/protocol/REST-Protocol.html

public class RestTestClient {

    public static void main(String[] args ) throws HttpAction {
        final String casUrlPrefix = "http://sso.Sophon.top/sign/authz/cas/";
        String username ="admin";
        String password ="Sophon";
        String serviceUrl = "http://cas.demo.Sophon.top:8080/demo-cas/";
        CasConfiguration casConfiguration = new CasConfiguration(casUrlPrefix);
        final CasRestAuthenticator authenticator = new CasRestAuthenticator(casConfiguration);
        final CasRestFormClient client = new CasRestFormClient(casConfiguration,"username","password");
        final MockHttpServletRequest request = new MockHttpServletRequest();
        final MockHttpServletResponse response = new MockHttpServletResponse();

        final WebContext webContext = new J2EContext(request, response);
        casConfiguration.init();
        UsernamePasswordCredentials credentials = new UsernamePasswordCredentials(username,password);
        CasRestAuthenticator restAuthenticator = new CasRestAuthenticator(casConfiguration);
        // authenticate with credentials (validate credentials)
        restAuthenticator.validate(credentials, webContext);
        final CasRestProfile profile = (CasRestProfile) credentials.getUserProfile();
        // get service ticket
        final TokenCredentials casCredentials = client.requestServiceTicket(serviceUrl, profile, webContext);
        // validate service ticket
        final CasProfile casProfile = client.validateServiceTicket(serviceUrl, casCredentials, webContext);
        
        Map<String,Object> attributes = casProfile.getAttributes();
        Set<Map.Entry<String,Object>> mapEntries = attributes.entrySet();
        for (Map.Entry entry : mapEntries) {
            System.out.println(entry.getKey() + ":" + entry.getValue());
        }
        client.destroyTicketGrantingTicket(profile,webContext);
    }
}
```

璇︾粏瑙佽鍙傝€?

https://github.com/SophonTop/Sophon/blob/master/Sophon-protocols/Sophon-protocol-cas/src/test/java/org/Sophon/web/authorize/endpoint/RestTestClient.java
