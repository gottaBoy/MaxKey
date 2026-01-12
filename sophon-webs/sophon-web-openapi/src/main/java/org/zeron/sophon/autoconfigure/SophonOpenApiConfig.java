/*
 * Copyright [2025] [zeron of copyright http://www.zeron.com]
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
 

package org.zeron.sophon.autoconfigure;

import org.zeron.sophon.authn.realm.jdbc.JdbcAuthenticationRealm;
import org.zeron.sophon.ip2location.IpLocationParser;
import org.zeron.sophon.password.onetimepwd.AbstractOtpAuthn;
import org.zeron.sophon.password.onetimepwd.impl.TimeBasedOtpAuthn;
import org.zeron.sophon.persistence.service.HistoryLoginService;
import org.zeron.sophon.persistence.service.LoginService;
import org.zeron.sophon.persistence.service.PasswordPolicyValidatorService;
import org.zeron.sophon.persistence.service.UserInfoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

@AutoConfiguration
public class SophonOpenApiConfig{
    private static final  Logger logger = LoggerFactory.getLogger(SophonOpenApiConfig.class);

    //authenticationRealm for SophonMgtApplication
    @Bean
    JdbcAuthenticationRealm authenticationRealm(
                @Qualifier("passwordEncoder")
                PasswordEncoder passwordEncoder,
                PasswordPolicyValidatorService passwordPolicyValidatorService,
                LoginService loginService,
                HistoryLoginService historyLoginService,
                UserInfoService userInfoService,
                IpLocationParser  ipLocationParser,
                JdbcTemplate jdbcTemplate) {
        
        JdbcAuthenticationRealm authenticationRealm = new JdbcAuthenticationRealm(
                passwordEncoder,
                passwordPolicyValidatorService,
                loginService,
                historyLoginService,
                userInfoService,
                ipLocationParser,
                jdbcTemplate);
        
        logger.debug("JdbcAuthenticationRealm inited.");
        return authenticationRealm;
    }

    @Bean
    AbstractOtpAuthn timeBasedOtpAuthn() {
        AbstractOtpAuthn tfaOtpAuthn = new TimeBasedOtpAuthn();
        logger.debug("TimeBasedOtpAuthn inited.");
        return tfaOtpAuthn;
    }
}

