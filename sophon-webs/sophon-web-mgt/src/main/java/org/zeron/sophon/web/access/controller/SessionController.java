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
 

package org.zeron.sophon.web.access.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import org.zeron.sophon.authn.annotation.CurrentUser;
import org.zeron.sophon.authn.session.SessionManager;
import org.zeron.sophon.entity.Message;
import org.zeron.sophon.entity.history.HistoryLogin;
import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.persistence.service.HistoryLoginService;
import org.zeron.sophon.persistence.service.HistorySystemLogsService;
import org.zeron.sophon.util.DateUtils;
import org.zeron.sophon.util.StrUtils;
import org.dromara.mybatis.jpa.entity.JpaPageResults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * 登录会话管理.
 * 
 * @author yi.min
 *
 */

@RestController
@RequestMapping(value = { "/access/session" })
public class SessionController {
    static final Logger logger = LoggerFactory.getLogger(SessionController.class);

    @Autowired
    HistoryLoginService historyLoginService;
    
    @Autowired
    SessionManager sessionManager;

    @Autowired
    HistorySystemLogsService systemLog;
    
    /**
     * 查询登录日志.
     * 
     * @param logsAuth
     * @return
     */
    @RequestMapping(value = { "/fetch" })
    @ResponseBody
    public Message<?> fetch(
                @ModelAttribute("historyLogin") HistoryLogin historyLogin,
                @CurrentUser UserInfo currentUser) {
        logger.debug("history/session/fetch {}" , historyLogin);
        historyLogin.setInstId(currentUser.getInstId());
        return new Message<JpaPageResults<HistoryLogin>>(
                    historyLoginService.queryOnlineSession(historyLogin)
                );
    }


    
    @ResponseBody
    @RequestMapping(value="/terminate")  
    public Message<?> terminate(@RequestParam("ids") String ids,@CurrentUser UserInfo currentUser) {
        logger.debug(ids);
        boolean isTerminated = false;
        try {
            for(String sessionId : StrUtils.string2List(ids, ",")) {
                logger.trace("terminate session Id {} ",sessionId);
                if(currentUser.getSessionId().contains(sessionId)) {
                    continue;//skip current session
                }
                sessionManager.terminate(sessionId,currentUser.getId(),currentUser.getUsername());
            }
            isTerminated = true;
        }catch(Exception e) {
            logger.debug("terminate Exception .",e);
        }
        
        if(isTerminated) {
            return new Message<HistoryLogin>(Message.SUCCESS);
        } else {
            return new Message<HistoryLogin>(Message.ERROR);
        }
    }
    
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat(DateUtils.FORMAT_DATE_HH_MM_SS);
        dateFormat.setLenient(false);
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }
}

