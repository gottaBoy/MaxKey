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

import java.awt.image.BufferedImage;

import org.apache.commons.lang3.StringUtils;
import org.zeron.sophon.authn.annotation.CurrentUser;
import org.zeron.sophon.crypto.Base32Utils;
import org.zeron.sophon.crypto.Base64Utils;
import org.zeron.sophon.crypto.password.PasswordReciprocal;
import org.zeron.sophon.entity.Message;
import org.zeron.sophon.entity.dto.TimeBasedDto;
import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.password.onetimepwd.algorithm.OtpKeyUriFormat;
import org.zeron.sophon.password.onetimepwd.algorithm.OtpSecret;
import org.zeron.sophon.password.onetimepwd.impl.TimeBasedOtpAuthn;
import org.zeron.sophon.persistence.service.UserInfoService;
import org.zeron.sophon.util.QRCodeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


/**
 * .
 * @author yi.min
 *
 */
@RestController
@RequestMapping(value  =  { "/config/timebased" })
public class OneTimePasswordController {
    static final  Logger logger  =  LoggerFactory.getLogger(OneTimePasswordController.class);

    @Autowired
    UserInfoService userInfoService;

    @Autowired
    OtpKeyUriFormat otpKeyUriFormat;

    @Autowired
    TimeBasedOtpAuthn timeBasedOtpAuthn;

    @GetMapping(value = {"/view"})
    public Message<TimeBasedDto> view(@CurrentUser UserInfo currentUser) {
        UserInfo user = userInfoService.get(currentUser.getId());
        String sharedSecret = "";
        String qrCode = "";
        if(StringUtils.isNotBlank(user.getSharedSecret())) {
            sharedSecret = PasswordReciprocal.getInstance().decoder(user.getSharedSecret());
            qrCode = genQRCode(sharedSecret,currentUser.getUsername());
        }
        return new Message<>(
                new TimeBasedDto(
                        user.getDisplayName(),
                        user.getUsername(),
                        otpKeyUriFormat.getDigits(),
                        otpKeyUriFormat.getPeriod(),
                        sharedSecret,
                        qrCode,
                        ""
                ));
    }
    
    @GetMapping(value = {"/generate"})
    public Message<TimeBasedDto> generate(@CurrentUser UserInfo currentUser) {
        //generate
        byte[] byteSharedSecret = OtpSecret.generate(otpKeyUriFormat.getCrypto());
        String sharedSecret = Base32Utils.encode(byteSharedSecret);
        String qrCode = genQRCode(sharedSecret,currentUser.getUsername());
        return new Message<>(
                new TimeBasedDto(
                        currentUser.getDisplayName(),
                        currentUser.getUsername(),
                        otpKeyUriFormat.getDigits(),
                        otpKeyUriFormat.getPeriod(),
                        sharedSecret,
                        qrCode,
                        ""
                ));
    }
    
    @PutMapping(value = {"/update"})
    public Message<String> update(@RequestBody TimeBasedDto timeBasedDto , @CurrentUser UserInfo currentUser) {
        // 浠庡綋鍓嶇敤鎴蜂俊鎭腑鑾峰彇鍏变韩瀵嗛??
        UserInfo user = new UserInfo();
        user.setId(currentUser.getId());
        user.setSharedSecret(PasswordReciprocal.getInstance().encode(timeBasedDto.sharedSecret()));
        // 璁＄畻褰撳墠鏃堕棿瀵瑰簲鐨勫姩鎬佸瘑鐮?
        if (StringUtils.isNotBlank(timeBasedDto.otpCode()) && timeBasedOtpAuthn.validate(user, timeBasedDto.otpCode())) {
            userInfoService.updateSharedSecret(user);
            return new Message<>(Message.SUCCESS);
        } else {
            return new Message<>(Message.FAIL);
        }
    }

    public String genQRCode(String sharedSecret,String username) {
        otpKeyUriFormat.setSecret(sharedSecret);
        String otpauth = otpKeyUriFormat.format(username);
        BufferedImage bufferedImage  =  QRCodeUtils.write2BufferedImage(otpauth, "gif", 300, 300);
        return Base64Utils.encodeImage(bufferedImage);
    }

    @GetMapping("/verify")
    public Message<String> verify(@RequestParam("otpCode") String otpCode, @CurrentUser UserInfo currentUser) {
        // 浠庡綋鍓嶇敤鎴蜂俊鎭腑鑾峰彇鍏变韩瀵嗛??
        UserInfo user = userInfoService.get(currentUser.getId());
        // 璁＄畻褰撳墠鏃堕棿瀵瑰簲鐨勫姩鎬佸瘑鐮?
        boolean validate = timeBasedOtpAuthn.validate(user, otpCode);
        if (validate) {
            return new Message<>(0,"One-Time Password verification succeeded");
        } else {
            return new Message<>(2,"One-Time Password verification failed");
        }
    }
    
}

