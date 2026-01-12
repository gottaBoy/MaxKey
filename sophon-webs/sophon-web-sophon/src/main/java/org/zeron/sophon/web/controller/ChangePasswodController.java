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


package org.zeron.sophon.web.controller;

import org.zeron.sophon.authn.annotation.CurrentUser;
import org.zeron.sophon.constants.ConstsEntryType;
import org.zeron.sophon.constants.ConstsAct;
import org.zeron.sophon.constants.ConstsActResult;
import org.zeron.sophon.constants.ConstsPasswordSetType;
import org.zeron.sophon.entity.ChangePassword;
import org.zeron.sophon.entity.Message;
import org.zeron.sophon.entity.cnf.CnfPasswordPolicy;
import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.persistence.service.HistorySystemLogsService;
import org.zeron.sophon.persistence.service.CnfPasswordPolicyService;
import org.zeron.sophon.persistence.service.UserInfoService;
import org.zeron.sophon.persistence.service.impl.PasswordPolicyValidatorServiceImpl;
import org.zeron.sophon.web.WebContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value={"/users"})
public class ChangePasswodController {
    static final Logger logger = LoggerFactory.getLogger(ChangePasswodController.class);

    @Autowired
    UserInfoService userInfoService;

    @Autowired
    HistorySystemLogsService systemLog;

    @Autowired
    CnfPasswordPolicyService passwordPolicyService;

    @GetMapping(value={"/passwordpolicy"})
    public Message<CnfPasswordPolicy> passwordpolicy(@CurrentUser UserInfo currentUser){
        CnfPasswordPolicy passwordPolicy = passwordPolicyService.get(currentUser.getInstId());
        //构建密码强度说明
        passwordPolicyService.buildTipMessage(passwordPolicy);
        return new Message<>(passwordPolicy);
    }

    @PutMapping(value = { "/changePassword" })
    public Message<ChangePassword> changePasswod(
            @RequestBody ChangePassword changePassword,
            @CurrentUser UserInfo currentUser) {
        if(!currentUser.getId().equals(changePassword.getId())){
            return null;
        }
        changePassword.setUserId(currentUser.getId());
        changePassword.setUsername(currentUser.getUsername());
        changePassword.setInstId(currentUser.getInstId());
        changePassword.setPasswordSetType(ConstsPasswordSetType.PASSWORD_NORMAL);
        if(userInfoService.changePassword(changePassword)) {
            systemLog.insert(
                    ConstsEntryType.USERINFO,
                    changePassword,
                    ConstsAct.CHANGE_PASSWORD,
                    ConstsActResult.SUCCESS,
                    currentUser);
            return new Message<>();
        }else {
            String message = (String) WebContext.getAttribute(PasswordPolicyValidatorServiceImpl.PASSWORD_POLICY_VALIDATE_RESULT);
            logger.info("-message: {}",message);
            return new Message<>(Message.ERROR,message);
        }
    }

}

