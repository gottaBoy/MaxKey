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
import org.zeron.sophon.entity.history.HistoryLoginApps;
import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.persistence.service.HistoryLoginAppsService;
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
 * 单点登录日志查询
 * 
 * @author yi.min
 *
 */

@Controller
@RequestMapping(value={"/historys"})
public class LoginAppsHistoryController {
    static final Logger logger = LoggerFactory.getLogger(LoginAppsHistoryController.class);
    
    @Autowired
      HistoryLoginAppsService historyLoginAppsService;
    
    /**
     * @param loginAppsHistory
     * @return
     */
    @RequestMapping(value={"/loginAppsHistory/fetch"})
    @ResponseBody
    public Message<?> fetch(
                @ModelAttribute("historyLoginApp") HistoryLoginApps historyLoginApp,
                @CurrentUser UserInfo currentUser){
        logger.debug("historys/loginAppsHistory/fetch/  {}",historyLoginApp);
        historyLoginApp.setId(null);
        historyLoginApp.setUserId(currentUser.getId());
        historyLoginApp.setInstId(currentUser.getInstId());
        return new Message<JpaPageResults<HistoryLoginApps>>(
                    historyLoginAppsService.fetchPageResults(historyLoginApp)
                );
    }

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat(DateUtils.FORMAT_DATE_HH_MM_SS);
        dateFormat.setLenient(false);  
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }
}

