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
package org.zeron.sophon.authz.endpoint;


import org.zeron.sophon.constants.ConstsProtocols;
import org.zeron.sophon.entity.apps.Apps;
import org.zeron.sophon.persistence.service.AppsCasDetailsService;
import org.zeron.sophon.web.WebConstants;
import org.zeron.sophon.web.WebContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
@Tag(name = "1-2认证总地址文档模块")
@Controller
public class AuthorizeEndpoint extends AuthorizeBaseEndpoint{
    static final  Logger _logger = LoggerFactory.getLogger(AuthorizeEndpoint.class);
    
    @Autowired
    AppsCasDetailsService casDetailsService;
    
    //all single sign on url
    @Operation(summary = "认证总地址接口", description = "参数应用ID，分发到不同应用的认证地址",method="GET")
    @GetMapping("/authz/{id}")
    public ModelAndView authorize(HttpServletRequest request,@PathVariable("id") String id){
        Apps  app = getApp(id);
        WebContext.setAttribute(WebConstants.SINGLE_SIGN_ON_APP_ID, app.getId());
        ModelAndView modelAndView = WebContext.redirect(app.getLoginUrl());
        
        if(app.getProtocol().equalsIgnoreCase(ConstsProtocols.EXTEND_API)){
            modelAndView=WebContext.forward("/authz/api/"+app.getId());
        }else if (app.getProtocol().equalsIgnoreCase(ConstsProtocols.FORMBASED)){
             modelAndView=WebContext.forward("/authz/formbased/"+app.getId());
        }else if (app.getProtocol().equalsIgnoreCase(ConstsProtocols.OAUTH20)){
             modelAndView=WebContext.forward("/authz/oauth/v20/"+app.getId());
        }else if (app.getProtocol().equalsIgnoreCase(ConstsProtocols.OAUTH21)){
            modelAndView=WebContext.redirect(app.getLoginUrl());
        }else if (app.getProtocol().equalsIgnoreCase(ConstsProtocols.OPEN_ID_CONNECT10)){
            modelAndView=WebContext.forward("/authz/oauth/v20/"+app.getId());
        }else if (app.getProtocol().equalsIgnoreCase(ConstsProtocols.SAML20)){
             modelAndView=WebContext.forward("/authz/saml20/idpinit/"+app.getId());
        }else if (app.getProtocol().equalsIgnoreCase(ConstsProtocols.TOKENBASED)){
            modelAndView=WebContext.forward("/authz/tokenbased/"+app.getId());
        }else if (app.getProtocol().equalsIgnoreCase(ConstsProtocols.CAS)){
            modelAndView=WebContext.forward("/authz/cas/"+app.getId());
        }else if (app.getProtocol().equalsIgnoreCase(ConstsProtocols.JWT)){
            modelAndView=WebContext.forward("/authz/jwt/"+app.getId());
        }else if (app.getProtocol().equalsIgnoreCase(ConstsProtocols.BASIC)){
            modelAndView=WebContext.redirect(app.getLoginUrl());
        }

        _logger.debug("redirect to view {}",modelAndView.getViewName());
        
        return modelAndView;
    }
    
    @GetMapping("/authz/refused")
    public ModelAndView refused(){
        ModelAndView modelAndView = new ModelAndView("authorize/authorize_refused");
        Apps app = (Apps)WebContext.getAttribute(WebConstants.AUTHORIZE_SIGN_ON_APP);
        if(app != null) {
            app.transIconBase64();
        }
        modelAndView.addObject("model", app);
        return modelAndView;
    }
    
}

