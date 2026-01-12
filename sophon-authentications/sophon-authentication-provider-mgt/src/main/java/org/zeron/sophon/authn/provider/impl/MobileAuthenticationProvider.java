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
import org.zeron.sophon.constants.ConstsLoginType;
import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.password.onetimepwd.AbstractOtpAuthn;
import org.zeron.sophon.password.sms.SmsOtpAuthnService;
import org.zeron.sophon.web.WebConstants;
import org.zeron.sophon.web.WebContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;


/**
 * Mobile Authentication provider.
 * @author yi.min
 *
 */
public class MobileAuthenticationProvider extends AbstractAuthenticationProvider {

    private static final Logger _logger =
            LoggerFactory.getLogger(MobileAuthenticationProvider.class);

    SmsOtpAuthnService smsOtpAuthnService;
    
    @Override
    public String getProviderName() {
        return "mobile" + PROVIDER_SUFFIX;
    }


    public MobileAuthenticationProvider() {
        super();
    }


    public MobileAuthenticationProvider(
            AbstractAuthenticationRealm authenticationRealm,
            ApplicationConfig applicationConfig,
            SmsOtpAuthnService smsOtpAuthnService,
            SessionManager sessionManager) {
        this.authenticationRealm = authenticationRealm;
        this.applicationConfig = applicationConfig;
        this.smsOtpAuthnService = smsOtpAuthnService;
        this.sessionManager = sessionManager;
    }

    @Override
    public Authentication doAuthenticate(LoginCredential loginCredential) {
        UsernamePasswordAuthenticationToken authenticationToken = null;
        _logger.debug("Trying to authenticate user '{}' via {}",
                loginCredential.getPrincipal(), getProviderName());
        try {

            //如果是验证码登录，设置mobile为username
            loginCredential.setUsername(loginCredential.getMobile());
            //设置密码为验证码
            loginCredential.setPassword(loginCredential.getOtpCaptcha());

            _logger.debug("authentication " + loginCredential);

            emptyPasswordValid(loginCredential.getPassword());

            emptyUsernameValid(loginCredential.getUsername());

            UserInfo userInfo =  loadUserInfo(loginCredential.getUsername(),loginCredential.getPassword());

            isUserExist(loginCredential , userInfo);
            
            statusValid(loginCredential , userInfo);

            mobileCaptchaValid(loginCredential.getPassword(),userInfo);

            //apply PasswordSetType and resetBadPasswordCount
            authenticationRealm.getLoginService().applyPasswordPolicy(userInfo);

            authenticationToken = createOnlineTicket(loginCredential,userInfo);
            // user authenticated
            _logger.debug("'{}' authenticated successfully by {}.",
                    loginCredential.getPrincipal(), getProviderName());

            authenticationRealm.insertLoginHistory(userInfo,
                    ConstsLoginType.LOCAL,
                    "",
                    "xe00000004",
                    WebConstants.LOGIN_RESULT.SUCCESS);
        } catch (AuthenticationException e) {
            _logger.error("Failed to authenticate user {} via {}: {}",
                    new Object[] {  loginCredential.getPrincipal(),
                            getProviderName(),
                            e.getMessage() });
            WebContext.setAttribute(
                    WebConstants.LOGIN_ERROR_SESSION_MESSAGE, e.getMessage());
        } catch (Exception e) {
            _logger.error("Login error Unexpected exception in {} authentication:\n{}" ,
                    getProviderName(), e.getMessage());
        }

        return  authenticationToken;
    }


    /**
     * mobile validate.
     *
     * @param otpCaptcha String
     * @param authType   String
     * @param userInfo   UserInfo
     */
    protected void mobileCaptchaValid(String password, UserInfo userInfo) {
        // for mobile password
        if (applicationConfig.getLoginConfig().isMfa()) {
            UserInfo validUserInfo = new UserInfo();
            validUserInfo.setUsername(userInfo.getUsername());
            validUserInfo.setId(userInfo.getId());
            AbstractOtpAuthn smsOtpAuthn = smsOtpAuthnService.getByInstId(userInfo.getInstId());
            if (password == null || !smsOtpAuthn.validate(validUserInfo, password)) {
                String message = WebContext.getI18nValue("login.error.captcha");
                _logger.debug("login captcha valid error.");
                throw new BadCredentialsException(message);
            }
        }
    }

}
