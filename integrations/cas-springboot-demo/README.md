# cas-springboot-demo浣跨敤

婧愪唬鐮佸湴鍧€  https://gitee.com/dromara/Sophon/tree/main/integrations/cas-springboot-demo

鎰熻阿 xiazhenyou 鎻愪緵Demo銆?

# cas-springboot-demo
鍩轰簬spring boot閰嶇疆cas瀹㈡埛绔?
demo鍒嗗埆鍐欎簡涓変釜璇锋眰:鎷︽埅璇锋眰 test1/index,test1/index1 浠ュ強涓嶆嫤鎴姹倀est1/index2,
## 绗竴姝ワ紝寮曞叆cas 瀹㈡埛绔墍闇€鍖?
      <dependency>
            <groupId>net.unicon.cas</groupId>
            <artifactId>cas-client-autoconfig-support</artifactId>
            <version>2.3.0-GA</version>
      </dependency>
## 绗簩閮紝閰嶇疆spring boot 閰嶇疆鏂囦欢
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
````
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
````
## 绗笁閮?鍦╝pplication鍚姩绫讳笂鍔犱笂 @EnableCasClient 娉ㄨВ
```java
@SpringBootApplication
@EnableCasClient
public class CasClientDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

}
```
## 绗洓姝?鍦ㄤ唬鐮佷腑鑾峰彇鐧诲綍鐢ㄦ埛淇℃伅
``` java
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

