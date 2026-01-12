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
 



package org.zeron.sophon.authn.provider.twofactor.impl;

import org.zeron.sophon.authn.LoginCredential;
import org.zeron.sophon.authn.provider.AbstractAuthenticationProvider;
import org.zeron.sophon.authn.realm.AbstractAuthenticationRealm;
import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.password.onetimepwd.AbstractOtpAuthn;
import org.zeron.sophon.web.WebConstants;
import org.zeron.sophon.web.WebContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;


/**
 * TwoFactorTotp Authentication provider.二次认证TOTP认证提供??
 * 
 * @author yi.min
 *
 */
public class TwoFactorTotpAuthenticationProvider extends AbstractAuthenticationProvider {
    private static final Logger logger = LoggerFactory.getLogger(TwoFactorTotpAuthenticationProvider.class);
    
    public String getProviderName() {
        return "twoFactorTotp" + PROVIDER_SUFFIX;
    }
 
    public TwoFactorTotpAuthenticationProvider(AbstractAuthenticationRealm authenticationRealm,AbstractOtpAuthn tfaOtpAuthn) {
        this.authenticationRealm = authenticationRealm;
        this.tfaOtpAuthn = tfaOtpAuthn;
    }

    @Override
    public Authentication doAuthenticate(LoginCredential credential) {
        return null;
    }
    
    @Override
    public Authentication doTwoFactorAuthenticate(LoginCredential credential,UserInfo user) {
        UsernamePasswordAuthenticationToken authenticationToken = null;
        logger.debug("loginCredential {}" , credential);
        try {
            //验证码校??
            UserInfo userTotp = authenticationRealm.loadUserInfoById(user.getId());
            
            matches(credential.getOtpCaptcha(),userTotp.getSharedSecret());
            
            authenticationToken = new UsernamePasswordAuthenticationToken(credential.getUsername(),"TOTP");
            
        } catch (AuthenticationException e) {
            logger.error("Failed to authenticate user {} via {}: {}",credential.getPrincipal(),
                                    getProviderName(),
                                    e.getMessage() );
            WebContext.setAttribute(WebConstants.LOGIN_ERROR_SESSION_MESSAGE, e.getMessage());
        } catch (Exception e) {
            logger.error("Login error Unexpected exception in {} authentication:\n{}" , getProviderName(), e.getMessage());
        }
       
        return  authenticationToken;
    }
    
    
    /**
     * 双因素验??
     * 
     * @param otpCaptcha String
     * @param authType   String
     * @param userInfo   UserInfo
     */
    protected void matches(String captcha, String sharedSecret) {
        // for one time password 2 factor
        if (captcha == null || !tfaOtpAuthn.validate(sharedSecret, captcha)) {
            String message = WebContext.getI18nValue("login.error.captcha");
            logger.debug("login captcha valid error.");
            throw new BadCredentialsException(message);
        }
    }
  
}

