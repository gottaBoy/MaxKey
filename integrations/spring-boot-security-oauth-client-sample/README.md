# spring-oauth-client-sample

## spring-boot-security-oauth-client-sample

### Application

```java
@SpringBootApplication
public class SpringBootOauthClientApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootOauthClientApplication.class, args);
	}

}
```

### application.yml

```ini
# 鎺堟潈鏈嶅姟鍦板潃
Sophon-auth-url: http://sso.Sophon.top/sign

security:
  oauth2:
    client:
      client-id: 1000185112135991296
      client-secret: 8Nv7MTcwNjIwMjQyMDU5Mzg5MDU65R
      scope: all
      user-authorization-uri: ${Sophon-auth-url}/authz/oauth/v20/authorize
      access-token-uri: ${Sophon-auth-url}/authz/oauth/v20/token
    resource:
      # 妫€鏌ヤ护鐗?
      #token-info-uri: ${Sophon-auth-url}/authz/oauth/v20/token
      # 鐢ㄦ埛淇℃伅
      user-info-uri: ${Sophon-auth-url}/api/oauth/v20/me
```

### ResourceServerConfiguration

```java
@Configuration
@EnableOAuth2Sso
public class ResourceServerConfiguration extends WebSecurityConfigurerAdapter {
	Logger log = LoggerFactory.getLogger(ResourceServerConfiguration.class);
	
	@Value("${Sophon-auth-url}") 
	String SophonAuthUrl;
	
	@Value("${security.oauth2.client.user-authorization-uri}") 
	String userAuthorizationUri;
	
	@Value("${security.oauth2.client.access-token-uri}") 
	String accessTokenUri;
	
	@Value("${security.oauth2.resource.user-info-uri}") 
	String userInfoUri;
	
    @Override
    public void configure(HttpSecurity http) throws Exception {
       //http.antMatcher("/orgs/**").antMatcher("/userinfo").antMatcher("/login").authorizeRequests().anyRequest().authenticated();
    	http.authorizeRequests().anyRequest().authenticated().and().csrf().disable();
    	log.info("UserAuthorizationUri {}" ,userAuthorizationUri);
    	log.info("AccessTokenUri {}" ,accessTokenUri);
    	log.info("UserInfoUri {}" ,userInfoUri);
    	if(accessTokenUri.startsWith("https")) {
    		HttpsTrusts.beforeConnection();
    	}
    	log.debug("ResourceServerConfiguration");
 
    }
}
```

### ResourceController

```java
@RestController
public class ResourceController {
	Logger log = LoggerFactory.getLogger(ResourceController.class);
			
    @GetMapping("/")
    public String index() {
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getPrincipal().toString();
    }
}

```
