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
import java.text.ParseException;
import java.util.HashMap;
import java.util.Objects;

import org.zeron.sophon.authn.LoginCredential;
import org.zeron.sophon.authn.QrCodeCredentialDto;
import org.zeron.sophon.authn.ScanCode;
import org.zeron.sophon.authn.jwt.AuthJwt;
import org.zeron.sophon.authn.jwt.AuthTokenService;
import org.zeron.sophon.authn.provider.AbstractAuthenticationProvider;
import org.zeron.sophon.authn.session.Session;
import org.zeron.sophon.authn.session.SessionManager;
import org.zeron.sophon.authn.web.AuthorizationUtils;
import org.zeron.sophon.crypto.Base64Utils;
import org.zeron.sophon.crypto.password.PasswordReciprocal;
import org.zeron.sophon.entity.*;
import org.zeron.sophon.exception.BusinessException;
import org.zeron.sophon.authn.provider.scancode.ScanCodeService;
import org.zeron.sophon.util.QRCodeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * @author yi.min
 *
 */
@Tag(name = "1-1-登录扫码接口文档模块")
@RestController
@RequestMapping(value = "/login")
public class LoginScanCodeEndpoint {
    private static Logger logger = LoggerFactory.getLogger(LoginScanCodeEndpoint.class);

    @Autowired
    AuthTokenService authTokenService;

    @Autowired
    AbstractAuthenticationProvider authenticationProvider ;

    @Autowired
    ScanCodeService scanCodeService;

    @Autowired
    SessionManager sessionManager;

     @Operation(summary = "生成登录扫描二维码", description = "生成登录扫描二维码")
     @GetMapping("/genScanCode")
     public Message<HashMap<String,String>> genScanCode() {
         logger.debug("/genScanCode.");
         String ticket = scanCodeService.createTicket();
         logger.debug("ticket: {}",ticket);
         String encodeTicket = PasswordReciprocal.getInstance().encode(ticket);
         BufferedImage bufferedImage  =  QRCodeUtils.write2BufferedImage(encodeTicket, "gif", 300, 300);
         String rqCode = Base64Utils.encodeImage(bufferedImage);
         HashMap<String,String> codeMap = new HashMap<>();
         codeMap.put("rqCode", rqCode);
         codeMap.put("ticket", encodeTicket);
         return new Message<>(Message.SUCCESS, codeMap);
     }

    @Operation(summary = "web二维码登录", description = "web二维码登录")
    @PostMapping("/sign/qrcode")
    public Message<AuthJwt> signByQrcode(@Validated @RequestBody ScanCode scanCode) {
        LoginCredential loginCredential = new LoginCredential();
        loginCredential.setAuthType(scanCode.getAuthType());
        loginCredential.setUsername(scanCode.getCode());

        if(authTokenService.validateJwtToken(scanCode.getState())){
            try {
                Authentication authentication = authenticationProvider.authenticate(loginCredential);
                if (Objects.nonNull(authentication)) {
                    //success
                    AuthJwt authJwt = authTokenService.genAuthJwt(authentication);
                    return new Message<>(authJwt);
                } else {
                    return new Message<>(Message.FAIL, "尚未扫码");
                }
            } catch (BusinessException businessException) {
                return new Message<>(businessException.getCode(), businessException.getMessage());
            }
        } else {
            return new Message<>(20005, "state失效重新获取");
        }
    }

    @Operation(summary = "App扫描二维码", description = "扫描二维码")
    @PostMapping("/scanCode")
    public Message<String> scanCode(@Validated @RequestBody QrCodeCredentialDto credentialDto) throws ParseException {
        logger.debug("/scanCode.");
        String jwtToken = credentialDto.getJwtToken();
        String code = credentialDto.getCode();
        try {
            //获取登录会话
            Session session = AuthorizationUtils.getSession(sessionManager, jwtToken);
            if (Objects.isNull(session)) {
                return new Message<>(Message.FAIL, "登录会话失效，请重新登录");
            }
            //查询二维码是否过??
            String ticketString = PasswordReciprocal.getInstance().decoder(code);
            boolean codeResult = scanCodeService.validateTicket(ticketString, session);
            if (!codeResult) {
                return new Message<>(Message.FAIL, "二维码已过期，请重新获取");
            }

        } catch (ParseException e) {
            logger.error("ParseException.",e);
            return new Message<>(Message.FAIL, "token格式错误");
        }
        return new Message<>(Message.SUCCESS, "成功");
    }
}

