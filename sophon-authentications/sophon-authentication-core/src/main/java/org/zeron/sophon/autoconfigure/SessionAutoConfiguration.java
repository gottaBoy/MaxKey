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
 

package org.zeron.sophon.autoconfigure;

import org.zeron.sophon.authn.session.SessionManager;
import org.zeron.sophon.authn.session.impl.SessionManagerImpl;
import org.zeron.sophon.authn.web.HttpSessionListenerAdapter;
import org.zeron.sophon.authn.web.SavedRequestAwareAuthenticationSuccessHandler;
import org.zeron.sophon.persistence.redis.RedisConnectionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;


@AutoConfiguration
public class SessionAutoConfiguration  {
    private static final  Logger _logger = 
            LoggerFactory.getLogger(SessionAutoConfiguration.class);
    
    
    @Bean(name = "savedRequestSuccessHandler")
    SavedRequestAwareAuthenticationSuccessHandler 
            savedRequestAwareAuthenticationSuccessHandler() {
        return new SavedRequestAwareAuthenticationSuccessHandler();
    }
    
    @Bean
    SessionManager sessionManager(
            @Value("${sophon.server.persistence}") int persistence,
            JdbcTemplate jdbcTemplate,
            RedisConnectionFactory redisConnFactory,
            @Value("${sophon.auth.session.timeout:1800}") int timeout
            ) {
        _logger.debug("session timeout {}" , timeout);
        return new SessionManagerImpl(
                persistence, jdbcTemplate, redisConnFactory,timeout);
    }

    @Bean
    HttpSessionListenerAdapter httpSessionListenerAdapter() {
        return new HttpSessionListenerAdapter();
    }
    
}

