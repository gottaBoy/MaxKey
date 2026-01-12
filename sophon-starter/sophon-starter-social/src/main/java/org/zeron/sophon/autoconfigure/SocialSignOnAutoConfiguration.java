/*
 * Copyright [2020] [Sophon of copyright http://www.sophon.console]
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

import org.zeron.sophon.authn.support.socialsignon.service.JdbcSocialsAssociateService;
import org.zeron.sophon.authn.support.socialsignon.service.SocialSignOnProviderService;
import org.zeron.sophon.authn.support.socialsignon.token.RedisTokenStore;
import org.zeron.sophon.entity.SocialsProvider;
import org.zeron.sophon.persistence.redis.RedisConnectionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.jdbc.core.JdbcTemplate;

@AutoConfiguration
@ComponentScan(basePackages = {
        "org.Sophon.authn.support.socialsignon"
})
public class SocialSignOnAutoConfiguration{
    private static final  Logger _logger = LoggerFactory.getLogger(SocialSignOnAutoConfiguration.class);
    
    @Bean(name = "socialSignOnProviderService")
    @ConditionalOnClass(SocialsProvider.class)
    SocialSignOnProviderService socialSignOnProviderService(
            @Value("${sophon.server.persistence}") int persistence,
            JdbcTemplate jdbcTemplate,
            RedisConnectionFactory redisConnFactory) {
        SocialSignOnProviderService socialSignOnProviderService = new SocialSignOnProviderService(jdbcTemplate);
        //load default Social Providers from database
        socialSignOnProviderService.loadSocials("1");

        RedisTokenStore redisTokenStore = new RedisTokenStore();
        socialSignOnProviderService.setRedisTokenStore(redisTokenStore);

        _logger.debug("SocialSignOnProviderService inited.");
        return socialSignOnProviderService;
    }
    
    @Bean(name = "socialsAssociateService")
    JdbcSocialsAssociateService socialsAssociateService(JdbcTemplate jdbcTemplate) {
        JdbcSocialsAssociateService socialsAssociateService = new JdbcSocialsAssociateService(jdbcTemplate);
        _logger.debug("JdbcSocialsAssociateService inited.");
        return socialsAssociateService;
    }
   
}

