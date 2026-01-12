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

import com.tencentcloudapi.common.Credential;
import com.tencentcloudapi.common.profile.ClientProfile;
import com.tencentcloudapi.common.profile.HttpProfile;
import com.tencentcloudapi.sms.v20190711.SmsClient;
import com.tencentcloudapi.sms.v20190711.models.SendSmsRequest;
import com.tencentcloudapi.sms.v20190711.models.SendSmsResponse;

import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.password.sms.SmsOtpAuthn;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * 鑵捐浜戠煭淇￠獙璇?
 * @author shimingxy
 *
 */
public class SmsOtpAuthnTencentCloud extends SmsOtpAuthn {
    private static final  Logger logger = LoggerFactory.getLogger(SmsOtpAuthnTencentCloud.class);

    //
    String secretId;
    //
    String secretKey;
    //鐭俊SDKAPPID
    String smsSdkAppid;
    //鐭俊妯℃澘
    String templateId;
    //绛惧??
    String sign;
    
    public SmsOtpAuthnTencentCloud() {
        otpType = OtpTypes.SMS;
    }
    
    public SmsOtpAuthnTencentCloud(String secretId, String secretKey, String smsSdkAppid, String templateId,
            String sign) {
        otpType = OtpTypes.SMS;
        this.secretId = secretId;
        this.secretKey = secretKey;
        this.smsSdkAppid = smsSdkAppid;
        this.templateId = templateId;
        this.sign = sign;
    }

    @Override
    public boolean produce(UserInfo userInfo) {
        // 鎵嬫満??
        String mobile = userInfo.getMobile();
        if (mobile != null && !mobile.equals("")) {
            try {
                Credential cred = new Credential(secretId, secretKey);
                
                HttpProfile httpProfile = new HttpProfile();
                httpProfile.setEndpoint("sms.tencentcloudapi.com");

                ClientProfile clientProfile = new ClientProfile();
                clientProfile.setHttpProfile(httpProfile);
                
                SmsClient client = new SmsClient(cred, "ap-beijing", clientProfile);
                String token = this.genToken(userInfo);
                String params = "{\"PhoneNumberSet\":[\"" + mobile + "\"]," 
                        + "\"TemplateID\":\"" + templateId + "\",\"Sign\":\"" + sign + "\","
                        + "\"TemplateParamSet\":[\"" + token + "\",\"" + this.interval + "\"],"
                        + "\"SmsSdkAppid\":\"" + smsSdkAppid + "\"}";
                
                SendSmsRequest req = SendSmsRequest.fromJsonString(params, SendSmsRequest.class);
                
                SendSmsResponse resp = client.SendSms(req);
                
                logger.debug("responseString " + SendSmsRequest.toJsonString(resp));
                if (resp.getSendStatusSet()[0].getCode().equalsIgnoreCase("Ok")) {
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

    public String getSecretId() {
        return secretId;
    }

    public void setSecretId(String secretId) {
        this.secretId = secretId;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getSmsSdkAppid() {
        return smsSdkAppid;
    }

    public void setSmsSdkAppid(String smsSdkAppid) {
        this.smsSdkAppid = smsSdkAppid;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public String getSign() {
        return sign;
    }


    public void setSign(String sign) {
        this.sign = sign;
    }

    
}

