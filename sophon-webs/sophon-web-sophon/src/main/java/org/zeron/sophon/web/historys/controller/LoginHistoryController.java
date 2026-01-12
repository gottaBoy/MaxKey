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
 

package org.zeron.sophon.web.historys.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import org.zeron.sophon.authn.annotation.CurrentUser;
import org.zeron.sophon.entity.Message;
import org.zeron.sophon.entity.history.HistoryLogin;
import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.persistence.service.HistoryLoginService;
import org.zeron.sophon.util.DateUtils;
import org.dromara.mybatis.jpa.entity.JpaPageResults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 登录日志查询
 * 
 * @author yi.min
 *
 */

@Controller
@RequestMapping(value={"/historys"})
public class LoginHistoryController {
    static final  Logger logger = LoggerFactory.getLogger(LoginHistoryController.class);
    
    @Autowired
    HistoryLoginService loginHistoryService;
    
    /**
     * @param HistoryLogin
     * @return
     */
    @RequestMapping(value={"/loginHistory/fetch"})
    @ResponseBody
    public Message<?> fetch(
                @ModelAttribute("historyLogin") HistoryLogin historyLogin,
                @CurrentUser UserInfo currentUser
            ){
        logger.debug("historys/loginHistory/fetch/ {}",historyLogin);
        historyLogin.setInstId(currentUser.getInstId());
        historyLogin.setUserId(currentUser.getId());
        return new Message<JpaPageResults<HistoryLogin>>(
                    loginHistoryService.fetchPageResults(historyLogin)
                );
    }
    
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat(DateUtils.FORMAT_DATE_HH_MM_SS);
        dateFormat.setLenient(false);  
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }
}

