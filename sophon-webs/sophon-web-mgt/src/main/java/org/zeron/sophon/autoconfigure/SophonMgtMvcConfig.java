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

import org.zeron.sophon.authn.provider.AbstractAuthenticationProvider;
import org.zeron.sophon.authn.web.interceptor.PermissionInterceptor;
import org.zeron.sophon.configuration.ApplicationConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@EnableWebMvc
@AutoConfiguration
public class SophonMgtMvcConfig implements WebMvcConfigurer {
    private static final  Logger logger = LoggerFactory.getLogger(SophonMgtMvcConfig.class);
    
    @Autowired
      ApplicationConfig applicationConfig;
    
    @Autowired
    AbstractAuthenticationProvider authenticationProvider ;
    
    @Autowired
    PermissionInterceptor permissionInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //addPathPatterns 用于添加拦截规则 ??先把所有路径都加入拦截??再一个个排除
        //excludePathPatterns 表示改路径不用拦??
        logger.debug("add Interceptors");

        permissionInterceptor.setMgmt(true);
        
        registry.addInterceptor(permissionInterceptor)
                .addPathPatterns("/dashboard/**")
                .addPathPatterns("/orgs/**")
                .addPathPatterns("/users/**")
                .addPathPatterns("/apps/**")
                .addPathPatterns("/session/**")
                .addPathPatterns("/accounts/**")
                
                
                .addPathPatterns("/access/**")
                .addPathPatterns("/access/**/**")
                
                .addPathPatterns("/permissions/**")
                .addPathPatterns("/permissions/**/**")
                
                .addPathPatterns("/config/**")
                .addPathPatterns("/config/**/**")
                
                .addPathPatterns("/historys/**")
                .addPathPatterns("/historys/**/**")
                
                .addPathPatterns("/institutions/**")
                .addPathPatterns("/localization/**")
                
                .addPathPatterns("/file/upload/")
                .addPathPatterns("/api/idm/current/**") 
                
                .addPathPatterns("/logout")
                .addPathPatterns("/logout/**")
                ;
        
        logger.debug("add Permission Adapter");
        
    }

}

