/*
 * Copyright [2022] [Sophon of copyright http://www.sophon.console]
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
 

package org.zeron.sophon.authn.provider.impl;

import org.zeron.sophon.authn.LoginCredential;
import org.zeron.sophon.authn.provider.AbstractAuthenticationProvider;
import org.zeron.sophon.authn.realm.AbstractAuthenticationRealm;
import org.zeron.sophon.authn.session.SessionManager;
import org.zeron.sophon.configuration.ApplicationConfig;
import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.web.WebContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;

/**
 * Trusted Authentication provider.
 * @author yi.min
 *
 */
public class TrustedAuthenticationProvider extends AbstractAuthenticationProvider {
    private static final Logger _logger = LoggerFactory.getLogger(TrustedAuthenticationProvider.class);

    @Override
    public String getProviderName() {
        return "trusted" + PROVIDER_SUFFIX;
    }
    
    public TrustedAuthenticationProvider() {
        super();
    }

    public TrustedAuthenticationProvider(
            AbstractAuthenticationRealm authenticationRealm,
            ApplicationConfig applicationConfig,
            SessionManager sessionManager) {
        this.authenticationRealm = authenticationRealm;
        this.applicationConfig = applicationConfig;
        this.sessionManager = sessionManager;
    }

    @Override
    public Authentication doAuthenticate(LoginCredential loginCredential) {
        UserInfo loadeduserInfo = loadUserInfo(loginCredential.getUsername(), "");
        statusValid(loginCredential , loadeduserInfo);
        if (loadeduserInfo != null) {
            //Validate PasswordPolicy
            authenticationRealm.getLoginService().passwordPolicyValid(loadeduserInfo);
            //apply PasswordSetType and resetBadPasswordCount
            authenticationRealm.getLoginService().applyPasswordPolicy(loadeduserInfo);
            Authentication authentication = createOnlineTicket(loginCredential,loadeduserInfo);
            
            authenticationRealm.insertLoginHistory( loadeduserInfo, 
                                                    loginCredential.getAuthType(), 
                                                    loginCredential.getProvider(), 
                                                    loginCredential.getCode(), 
                                                    loginCredential.getMessage()
                                                );
            
            return authentication;
        }else {
            String i18nMessage = WebContext.getI18nValue("login.error.username");
            _logger.debug("login user {} not in this System . {}" , 
                            loginCredential.getUsername(),i18nMessage);
            throw new BadCredentialsException(WebContext.getI18nValue("login.error.username"));
        }
    }
  
}

