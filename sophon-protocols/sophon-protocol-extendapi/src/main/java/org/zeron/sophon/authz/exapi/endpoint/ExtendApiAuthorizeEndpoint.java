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
 

/**
 * 
 */
package org.zeron.sophon.authz.exapi.endpoint;

import org.zeron.sophon.authn.annotation.CurrentUser;
import org.zeron.sophon.authn.web.AuthorizationUtils;
import org.zeron.sophon.authz.endpoint.AuthorizeBaseEndpoint;
import org.zeron.sophon.authz.endpoint.adapter.AbstractAuthorizeAdapter;
import org.zeron.sophon.constants.ConstsBoolean;
import org.zeron.sophon.entity.Accounts;
import org.zeron.sophon.entity.apps.Apps;
import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.util.Instance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.ModelAndView;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;

/**
 * @author yi.min
 *
 */
@Tag(name = "2-8-ExtendApi接口文档模块")
@Controller
public class ExtendApiAuthorizeEndpoint  extends AuthorizeBaseEndpoint{
    static final  Logger _logger = LoggerFactory.getLogger(ExtendApiAuthorizeEndpoint.class);

    @Operation(summary = "ExtendApi认证地址接口", description = "参数应用ID")
    @GetMapping("/authz/api/{id}")
    public ModelAndView authorize(
            HttpServletRequest request,
            @PathVariable("id") String id,
            @CurrentUser UserInfo currentUser){
        
        ModelAndView modelAndView = new ModelAndView("authorize/redirect_sso_submit");
        modelAndView.addObject("errorCode", 0);
        modelAndView.addObject("errorMessage", "");
        
        Apps apps = getApp(id);
        _logger.debug("{}" , apps);
        if(ConstsBoolean.isTrue(apps.getIsAdapter())){
            _logger.debug("Adapter {}",apps.getAdapter());
            AbstractAuthorizeAdapter adapter = (AbstractAuthorizeAdapter)Instance.newInstance(apps.getAdapter());
            Accounts account = getAccounts(apps,currentUser);
            if(apps.getCredential().equalsIgnoreCase(Apps.CREDENTIALS.USER_DEFINED) && account == null) {
                return initCredentialView(id,"/authorize/api/"+id);
            }
            
            adapter.setPrincipal(AuthorizationUtils.getPrincipal());
            adapter.setApp(apps);
            adapter.setAccount(account);
            
            return adapter.authorize(modelAndView);
        }else{
            _logger.debug("redirect_uri {}",apps.getLoginUrl());
            modelAndView.addObject("redirect_uri", apps.getLoginUrl());
            return modelAndView;
        }
        
    }
}

