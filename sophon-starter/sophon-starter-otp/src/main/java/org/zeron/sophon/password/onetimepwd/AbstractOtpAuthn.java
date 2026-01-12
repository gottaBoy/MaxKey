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
 

package org.zeron.sophon.password.onetimepwd;

import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.password.onetimepwd.token.AbstractOtpTokenStore;
import org.zeron.sophon.password.onetimepwd.token.InMemoryOtpTokenStore;
import org.zeron.sophon.util.StringGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * AbstractOTPAuthn.
 * @author Administrator
 *
 */
public abstract class AbstractOtpAuthn {
    private static final  Logger logger = LoggerFactory.getLogger(AbstractOtpAuthn.class);

    protected AbstractOtpTokenStore optTokenStore = new InMemoryOtpTokenStore();
    
    //楠岃瘉鐮佹湁鏁堥枔闅?
    protected int interval = 30;
    
    // 楠岃瘉鐮侀暱搴︼紝鑼冨????0锛岄粯璁や负6
    protected int digits = 6;

    protected String crypto = "HmacSHA1";

    protected String defaultEncoding ="utf-8";
    
    StringGenerator stringGenerator;
    
    protected String otpType = OtpTypes.TIMEBASED_OTP;

    public static final class OtpTypes {
        // 鎵嬫満
        public static String  MOBILE = "MOBILE";
        // 鐭??
        public static String SMS = "SMS";
        // 閭??
        public static String EMAIL = "EMAIL";
        //TIMEBASED_OPT
        public static String TIMEBASED_OTP = "TOPT";
        // HmacOTP
        public static String HOTP_OTP = "HOTP";

        public static String RSA_OTP = "RSA";
        
        public static String CAP_OTP = "CAP";

    }

    public abstract boolean produce(UserInfo userInfo);

    public abstract boolean validate(UserInfo userInfo, String token);
    
    public abstract boolean validate(String sharedSecret, String token);

    protected String defaultProduce(UserInfo userInfo) {
        return genToken(userInfo);
    }

    /**
     * genToken.
     * @param userInfo UserInfo
     * @return
     */
    public String genToken(UserInfo userInfo) {
        if (stringGenerator == null) {
            stringGenerator = new StringGenerator(StringGenerator.DEFAULT_CODE_NUMBER, digits);
        }
        String token = stringGenerator.randomGenerate();
        logger.debug("Generator token " + token);
        return token;
    }

    /**
     *  the interval.
     * @return the interval
     */
    public int getInterval() {
        return interval;
    }

    /**
     * interval the interval to set.
     * @param interval the interval to set
     */
    public void setInterval(int interval) {
        this.interval = interval;
    }

    /**
     * digits.
     * @return the digits
     */
    public int getDigits() {
        return digits;
    }

    /**
     * digits the digits to set.
     * @param digits the digits to set
     */
    public void setDigits(int digits) {
        this.digits = digits;
    }

    /**
     * crypto.
     * @return the crypto
     */
    public String getCrypto() {
        return crypto;
    }

    /**
     * crypto the crypto to set.
     * @param crypto the crypto to set
     */
    public void setCrypto(String crypto) {
        this.crypto = crypto;
    }

    public String getOtpType() {
        return otpType;
    }

    public void setOtpType(String optType) {
        this.otpType = optType;
    }

    public void setOptTokenStore(AbstractOtpTokenStore optTokenStore) {
        this.optTokenStore = optTokenStore;
    }

    public void initPropertys() {
        
    }

    public String getDefaultEncoding() {
        return defaultEncoding;
    }

    public void setDefaultEncoding(String defaultEncoding) {
        this.defaultEncoding = defaultEncoding;
    }
 
}

