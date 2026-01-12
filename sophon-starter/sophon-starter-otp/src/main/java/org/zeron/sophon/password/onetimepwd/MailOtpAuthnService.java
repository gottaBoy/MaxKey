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
 

package org.zeron.sophon.password.onetimepwd;

import java.sql.Types;
import java.util.concurrent.TimeUnit;

import org.zeron.sophon.configuration.EmailConfig;
import org.zeron.sophon.constants.ConstsBoolean;
import org.zeron.sophon.crypto.password.PasswordReciprocal;
import org.zeron.sophon.entity.cnf.CnfEmailSenders;
import org.zeron.sophon.password.onetimepwd.impl.MailOtpAuthn;
import org.zeron.sophon.password.onetimepwd.token.RedisOtpTokenStore;
import org.zeron.sophon.persistence.service.CnfEmailSendersService;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

public class MailOtpAuthnService {

    protected static final Cache<String, AbstractOtpAuthn> otpAuthnStore = 
            Caffeine.newBuilder()
                .expireAfterWrite(60, TimeUnit.MINUTES)
                .build();

    CnfEmailSendersService emailSendersService;
    
    RedisOtpTokenStore redisOptTokenStore;
    
    public MailOtpAuthnService(CnfEmailSendersService emailSendersService) {
        this.emailSendersService = emailSendersService;
    }

    public MailOtpAuthnService(RedisOtpTokenStore redisOptTokenStore) {
        this.redisOptTokenStore = redisOptTokenStore;
    }


    public AbstractOtpAuthn getMailOtpAuthn(String instId) {
        AbstractOtpAuthn otpAuthn = otpAuthnStore.getIfPresent(instId);
        if(otpAuthn == null) {
            CnfEmailSenders emailSender = 
                    emailSendersService.findOne("where instid = ? ", new Object[]{instId}, new int[]{Types.VARCHAR});
            
            String credentials = PasswordReciprocal.getInstance().decoder(emailSender.getCredentials());
            EmailConfig emailConfig = 
                            new EmailConfig(
                                    emailSender.getAccount(),
                                    credentials,
                                    emailSender.getSmtpHost(),
                                    emailSender.getPort(),
                                    ConstsBoolean.isTrue(emailSender.getSslSwitch()),
                                    emailSender.getSender());
            MailOtpAuthn mailOtpAuthn = new MailOtpAuthn(emailConfig);
            mailOtpAuthn.setInterval(60 * 5);//5 minute
            if(redisOptTokenStore != null) {
                mailOtpAuthn.setOptTokenStore(redisOptTokenStore);
            }
            otpAuthn = mailOtpAuthn;
        }
        otpAuthnStore.put(instId, otpAuthn);    
        return otpAuthn;
    }

    public void setRedisOptTokenStore(RedisOtpTokenStore redisOptTokenStore) {
        this.redisOptTokenStore = redisOptTokenStore;
    }
    
    
}

