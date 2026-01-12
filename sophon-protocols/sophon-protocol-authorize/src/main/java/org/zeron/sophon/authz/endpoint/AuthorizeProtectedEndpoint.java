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

import org.zeron.sophon.authn.annotation.CurrentUser;
import org.zeron.sophon.crypto.password.PasswordReciprocal;
import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.web.WebConstants;
import org.zeron.sophon.web.WebContext;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;

/**
 * @author yi.min
 *
 */
@Controller
public class AuthorizeProtectedEndpoint{

    @GetMapping("/authz/protected/forward")
    public ModelAndView forwardProtectedForward(
            HttpServletRequest request ){
        String redirectUri=request.getAttribute("redirect_uri").toString();
        ModelAndView modelAndView=new ModelAndView("authorize/protected/forward");
        modelAndView.addObject("redirect_uri", redirectUri);
        return modelAndView;
    }
    
    @GetMapping("/authz/protected")
    public ModelAndView authorizeProtected(
            @RequestParam("password") String password,
            @RequestParam("redirect_uri") String redirectUri,
            @CurrentUser UserInfo currentUser){
        if( currentUser.getAppLoginPassword().equals(PasswordReciprocal.getInstance().encode(password))){
            WebContext.setAttribute(WebConstants.CURRENT_SINGLESIGNON_URI, redirectUri);
            return WebContext.redirect(redirectUri);
        }
        
        ModelAndView modelAndView=new ModelAndView("authorize/protected/forward");
        modelAndView.addObject("redirect_uri", redirectUri);
        return modelAndView;
    }
            
}

