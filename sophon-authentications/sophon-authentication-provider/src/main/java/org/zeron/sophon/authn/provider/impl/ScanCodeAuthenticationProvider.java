/*
 * Copyright [2024] [Sophon of copyright http://www.sophon.console]
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
import org.zeron.sophon.authn.SignPrincipal;
import org.zeron.sophon.authn.provider.AbstractAuthenticationProvider;
import org.zeron.sophon.authn.provider.scancode.ScanCodeService;
import org.zeron.sophon.authn.provider.scancode.ScanCodeState;

import org.zeron.sophon.authn.realm.AbstractAuthenticationRealm;
import org.zeron.sophon.authn.session.SessionManager;

import org.zeron.sophon.constants.ConstsLoginType;
import org.zeron.sophon.crypto.password.PasswordReciprocal;
import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.web.WebConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Objects;

/**
 * @description:
 * @author: orangeBabu
 * @time: 16/8/2024 PM4:54
 */
public class ScanCodeAuthenticationProvider extends AbstractAuthenticationProvider {

    private static final Logger _logger = LoggerFactory.getLogger(ScanCodeAuthenticationProvider.class);

    @Autowired
    ScanCodeService scanCodeService;

    public ScanCodeAuthenticationProvider() {
        super();
    }

    public ScanCodeAuthenticationProvider(
            AbstractAuthenticationRealm authenticationRealm,
            SessionManager sessionManager) {
        this.authenticationRealm = authenticationRealm;
        this.sessionManager = sessionManager;
    }

    @Override
    public String getProviderName() {
        return "scancode" + PROVIDER_SUFFIX;
    }

    @Override
    public Authentication doAuthenticate(LoginCredential loginCredential) {
        UsernamePasswordAuthenticationToken authenticationToken = null;

        String encodeTicket = PasswordReciprocal.getInstance().decoder(loginCredential.getUsername());

        ScanCodeState scanCodeState = scanCodeService.consume(encodeTicket);

        if (Objects.isNull(scanCodeState)) {
            return null;
        }

        SignPrincipal signPrincipal = (SignPrincipal) sessionManager.get(scanCodeState.getSessionId()).getAuthentication().getPrincipal();
        //获取用户信息
        UserInfo userInfo = signPrincipal.getUserInfo();

        isUserExist(loginCredential , userInfo);

        statusValid(loginCredential , userInfo);


        //创建登录会话
        authenticationToken = createOnlineTicket(loginCredential,userInfo);
        // user authenticated
        _logger.debug("'{}' authenticated successfully by {}.",
                loginCredential.getPrincipal(), getProviderName());

        authenticationRealm.insertLoginHistory(userInfo,
                ConstsLoginType.LOCAL,
                "",
                "xe00000004",
                WebConstants.LOGIN_RESULT.SUCCESS);

        return  authenticationToken;
    }
}

