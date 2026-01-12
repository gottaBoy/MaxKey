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
 

package org.zeron.sophon.password.sms.impl;

import com.aliyuncs.CommonRequest;
import com.aliyuncs.CommonResponse;
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.http.MethodType;
import com.aliyuncs.profile.DefaultProfile;

import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.password.sms.SmsOtpAuthn;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 闃块噷浜戠煭淇￠獙璇?
 * @author shimingxy
 *
 */
public class SmsOtpAuthnAliyun extends SmsOtpAuthn {
    private static final  Logger logger = LoggerFactory.getLogger(SmsOtpAuthnAliyun.class);
    
    public SmsOtpAuthnAliyun() {
        otpType = OtpTypes.SMS;
    }

    public SmsOtpAuthnAliyun(String accessKeyId, String accessSecret, String templateCode, String signName) {
        otpType = OtpTypes.SMS;
        this.accessKeyId = accessKeyId;
        this.accessSecret = accessSecret;
        this.templateCode = templateCode;
        this.signName = signName;
    }
    
    //璇锋浛鎹綘鍦ㄧ鐞嗗悗鍙板簲鐢ㄤ笅鐢宠鐨刟ccessKeyId
    private   String accessKeyId = "94395d754eb55693043f5d6a2b772ef3";
    //璇锋浛鎹綘鍦ㄧ鐞嗗悗鍙板簲鐢ㄤ笅鐢宠鐨刟ccessSecret
    private  String accessSecret = "05d5485357bc";
    // 鐭俊妯℃澘ID
    private  String templateCode = "SMS_187590021";
    
    private String signName = "Sophon";
    


    @Override
    public boolean produce(UserInfo userInfo) {
        // 鎵嬫満??
        String mobile = userInfo.getMobile();
        if (mobile != null && !mobile.equals("")) {
            try {
                DefaultProfile profile = DefaultProfile.getProfile(
                                    "cn-hangzhou", accessKeyId, accessSecret);
                IAcsClient client = new DefaultAcsClient(profile);

                String token = this.genToken(userInfo);
                CommonRequest request = new CommonRequest();
                request.setSysMethod(MethodType.POST);
                request.setSysDomain("dysmsapi.aliyuncs.com");
                request.setSysVersion("2017-05-25");
                request.setSysAction("SendSms");
                request.putQueryParameter("RegionId", "cn-hangzhou");
                request.putQueryParameter("PhoneNumbers", mobile);
                request.putQueryParameter("SignName", signName);
                request.putQueryParameter("TemplateCode", templateCode);
                request.putQueryParameter("TemplateParam", "{\"code\":\"" + token + "\"}");
                CommonResponse response = client.getCommonResponse(request);
                logger.debug("responseString " + response.getData());
                //鎴愬姛杩斿洖
                if (response.getData().indexOf("OK") > -1) {
                    this.optTokenStore.store(
                            userInfo, 
                            token, 
                            userInfo.getMobile(), 
                            OtpTypes.SMS);
                    return true;
                }
            } catch  (Exception e) {
                logger.error(" produce code error ", e);
            } 
        }
        return false;
    }

    @Override
    public boolean validate(UserInfo userInfo, String token) {
        return this.optTokenStore.validate(userInfo, token, OtpTypes.SMS, interval);
    }

    public String getAccessKeyId() {
        return accessKeyId;
    }

    public void setAccessKeyId(String accessKeyId) {
        this.accessKeyId = accessKeyId;
    }

    public String getAccessSecret() {
        return accessSecret;
    }

    public void setAccessSecret(String accessSecret) {
        this.accessSecret = accessSecret;
    }

    public String getTemplateCode() {
        return templateCode;
    }

    public void setTemplateCode(String templateCode) {
        this.templateCode = templateCode;
    }

    public String getSignName() {
        return signName;
    }

    public void setSignName(String signName) {
        this.signName = signName;
    }
    
}

