/*
 * Copyright [2025] [Sophon of copyright http://www.sophon.console]
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 



 

package org.zeron.sophon.authn.provider.twofactor;

import java.util.HashMap;
import java.util.Map;

import org.zeron.sophon.authn.LoginCredential;
import org.zeron.sophon.authn.SignPrincipal;
import org.zeron.sophon.authn.jwt.AuthTokenService;
import org.zeron.sophon.authn.provider.AbstractAuthenticationProvider;
import org.zeron.sophon.authn.realm.AbstractAuthenticationRealm;
import org.zeron.sophon.authn.session.Session;
import org.zeron.sophon.authn.session.SessionManager;
import org.zeron.sophon.authn.web.AuthorizationUtils;
import org.zeron.sophon.constants.ConstsJwt;
import org.zeron.sophon.constants.ConstsLoginType;
import org.zeron.sophon.constants.ConstsTwoFactor;
import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.persistence.service.LoginService;
import org.zeron.sophon.web.WebConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import com.nimbusds.jwt.JWTClaimsSet;

/**
 * TwoFactor Authentication provider.双因素认证提供??
 * 
 * @author yi.min
 *
 */
public class TwoFactorAuthenticationProvider extends AbstractAuthenticationProvider {
    private static final Logger logger =LoggerFactory.getLogger(TwoFactorAuthenticationProvider.class);

    Map<String,AbstractAuthenticationProvider> twoFactorProvider = new HashMap<>();
    
    public String getProviderName() {
        return "twoFactor" + PROVIDER_SUFFIX;
    }
    
    public TwoFactorAuthenticationProvider(
            AbstractAuthenticationRealm authenticationRealm,
            SessionManager sessionManager,
            LoginService loginService,
            AuthTokenService authTokenService) {
        this.authenticationRealm = authenticationRealm;
        this.sessionManager = sessionManager;
        this.authTokenService = authTokenService;
    }
    
    public void addProvider(int twoFactor,AbstractAuthenticationProvider provider) {
        twoFactorProvider.put(twoFactor+"", provider);
    }

    @Override
    public Authentication doAuthenticate(LoginCredential credential) {
        logger.debug("Credential {}" , credential);
        emptyOtpCaptchaValid(credential.getOtpCaptcha());
        try {
            if(authTokenService.validateJwtToken(credential.getJwtToken())) {
                 //解析refreshToken，转换会话id
                 JWTClaimsSet claim = authTokenService.resolve(credential.getJwtToken());
                 String sessionId = claim.getJWTID();
                 String userId = claim.getClaim(ConstsJwt.USER_ID).toString();
                 //String style = claim.getClaim(AuthorizationUtils.STYLE).toString();
                 //尝试刷新会话
                 logger.trace("Try to  get user {} , sessionId [{}]" , userId, sessionId);
                 Session session  = sessionManager.getTwoFactor(sessionId);
                 if(session != null) {//有会??
                     Authentication twoFactorAuth  = null;
                     SignPrincipal principal =(SignPrincipal)  session.getAuthentication().getPrincipal();
                     String loginType;
                     switch(principal.getTwoFactor()) {
                         case ConstsTwoFactor.TOTP -> {
                             loginType = ConstsLoginType.TwoFactor.TWO_FACTOR_TOTP;
                         }
                         case ConstsTwoFactor.EMAIL -> {
                             loginType = ConstsLoginType.TwoFactor.TWO_FACTOR_EMAIL;
                         }
                         case ConstsTwoFactor.SMS -> {
                             loginType = ConstsLoginType.TwoFactor.TWO_FACTOR_MOBILE;
                         }
                         default ->{
                             loginType = ConstsLoginType.TwoFactor.TWO_FACTOR_TOTP;
                         }
                     }
                     logger.debug("loginType {}",loginType);
                     AbstractAuthenticationProvider authenticationProvider = twoFactorProvider.get(principal.getTwoFactor()+"");
                     logger.debug("Provider {}",authenticationProvider.getProviderName());
                     UserInfo user = authenticationRealm.loadUserInfoById(userId);
                     //进行浜屾认证鏍￠??
                     twoFactorAuth = authenticationProvider.doTwoFactorAuthenticate(credential , user);

                     if(twoFactorAuth != null) {
                         logger.debug("twoFactorAuth success .");
                         //设置正常状态€?
                         principal.clearTwoFactor();
                         //閲嶆柊设置令牌参??
                         sessionManager.create(sessionId, session);
                         sessionManager.removeTwoFactor(sessionId);
                         AuthorizationUtils.setAuthentication(session.getAuthentication());
                         authenticationRealm.insertLoginHistory(user, 
                                 loginType, 
                                "", 
                                "xe00000004",
                                WebConstants.LOGIN_RESULT.SUCCESS);
                         return session.getAuthentication();
                     }else {
                         logger.debug("twoFactorAuth fail .");
                     }
                 }else {//鏃犱細璇?
                     logger.debug("Session is timeout , sessionId [{}]" , sessionId);
                 }
             }else {//楠岃瘉失??
                 logger.debug("jwt token is not validate .");
             }
        }catch(Exception e) {
            logger.error("Exception !",e);
         }
        
        return  null;
    }
    
}

