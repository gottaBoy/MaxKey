/*
 * Copyright [2025] [Sophon of copyright http://www.sophon.console]
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

package org.zeron.sophon.passkey.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Passkey配置属性€?
 */
@ConfigurationProperties(prefix = "sophon.login.passkey")
public class PasskeyProperties {
    
    /**
     * 鏄惁鍚敤Passkey鍔熻??
     */
    private boolean enabled = true;
    
    /**
     * RP (Relying Party) 配置
     */
    private RelyingParty relyingParty = new RelyingParty();
    
    /**
     * 认证器配??
     */
    private Authenticator authenticator = new Authenticator();
    
    /**
     * 挑战配置
     */
    private Challenge challenge = new Challenge();
    
    /**
     * 用户限制配置
     */
    private UserLimits userLimits = new UserLimits();
    
    /**
     * 会话配置
     */
    private Session session = new Session();
    
    public boolean isEnabled() {
        return enabled;
    }
    
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
    
    public RelyingParty getRelyingParty() {
        return relyingParty;
    }
    
    public void setRelyingParty(RelyingParty relyingParty) {
        this.relyingParty = relyingParty;
    }
    
    public Authenticator getAuthenticator() {
        return authenticator;
    }
    
    public void setAuthenticator(Authenticator authenticator) {
        this.authenticator = authenticator;
    }
    
    public Challenge getChallenge() {
        return challenge;
    }
    
    public void setChallenge(Challenge challenge) {
        this.challenge = challenge;
    }
    
    public UserLimits getUserLimits() {
        return userLimits;
    }
    
    public void setUserLimits(UserLimits userLimits) {
        this.userLimits = userLimits;
    }
    
    public Session getSession() {
        return session;
    }
    
    public void setSession(Session session) {
        this.session = session;
    }
    
    /**
     * RP (Relying Party) 配置
     */
    // ??RelyingParty 绫讳腑娣诲姞
    public static class RelyingParty {
        /**
         * RP鍚嶇О
         */
        private String name = "Sophon";
        
        /**
         * RP ID锛堥€氬父鏄煙鍚嶏??
         */
        private String id = "localhost";
        
        /**
         * RP鍥炬爣URL
         */
        private String icon;
        
        /**
         * 鍏佽鐨?origins 鍒楄??
         */
        private java.util.List<String> allowedOrigins = java.util.Arrays.asList("http://localhost:8527", "http://localhost:8080");
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getId() {
            return id;
        }
        
        public void setId(String id) {
            this.id = id;
        }
        
        public String getIcon() {
            return icon;
        }
        
        public void setIcon(String icon) {
            this.icon = icon;
        }
    
        public java.util.List<String> getAllowedOrigins() {
            return allowedOrigins;
        }
    
        public void setAllowedOrigins(java.util.List<String> allowedOrigins) {
            this.allowedOrigins = allowedOrigins;
        }
    }
    
    /**
     * 认证器配??
     */
    public static class Authenticator {
        /**
         * 认证鍣ㄩ檮浠跺亸濂斤細platform, cross-platform, null
         */
        private String attachment = "platform";
        
        /**
         * 用户楠岃瘉瑕佹眰锛歳equired, preferred, discouraged
         */
        private String userVerification = "required";
        
        /**
         * 璇佹槑鍋忓ソ锛歯one, indirect, direct
         */
        private String attestation = "none";
        
        /**
         * 鏄惁瑕佹眰椹荤暀瀵嗛??
         */
        private boolean requireResidentKey = false;
        
        public String getAttachment() {
            return attachment;
        }
        
        public void setAttachment(String attachment) {
            this.attachment = attachment;
        }
        
        public String getUserVerification() {
            return userVerification;
        }
        
        public void setUserVerification(String userVerification) {
            this.userVerification = userVerification;
        }
        
        public String getAttestation() {
            return attestation;
        }
        
        public void setAttestation(String attestation) {
            this.attestation = attestation;
        }
        
        public boolean isRequireResidentKey() {
            return requireResidentKey;
        }
        
        public void setRequireResidentKey(boolean requireResidentKey) {
            this.requireResidentKey = requireResidentKey;
        }
    }
    
    /**
     * 挑战配置
     */
    public static class Challenge {
        /**
         * 鎸戞垬闀垮害锛堝瓧鑺傦級
         */
        private int length = 32;
        
        /**
         * 鎸戞垬过期鏃堕棿锛堝垎閽燂級
         */
        private int expireMinutes = 5;
        
        /**
         * 鎿嶄綔瓒呮椂鏃堕棿锛堟绉掞??
         */
        private long timeoutMs = 60000;
        
        /**
         * 鏄惁鑷姩娓呯悊过期鎸戞垬
         */
        private boolean autoCleanup = true;
        
        /**
         * 娓呯悊闂撮殧锛堝皬鏃讹級
         */
        private int cleanupIntervalHours = 1;
        
        public int getLength() {
            return length;
        }
        
        public void setLength(int length) {
            this.length = length;
        }
        
        public int getExpireMinutes() {
            return expireMinutes;
        }
        
        public void setExpireMinutes(int expireMinutes) {
            this.expireMinutes = expireMinutes;
        }
        
        public long getTimeoutMs() {
            return timeoutMs;
        }
        
        public void setTimeoutMs(long timeoutMs) {
            this.timeoutMs = timeoutMs;
        }
        
        public boolean isAutoCleanup() {
            return autoCleanup;
        }
        
        public void setAutoCleanup(boolean autoCleanup) {
            this.autoCleanup = autoCleanup;
        }
        
        public int getCleanupIntervalHours() {
            return cleanupIntervalHours;
        }
        
        public void setCleanupIntervalHours(int cleanupIntervalHours) {
            this.cleanupIntervalHours = cleanupIntervalHours;
        }
    }
    
    /**
     * 用户限制配置
     */
    public static class UserLimits {
        /**
         * 每个用户最大Passkey数量
         */
        private int maxPasskeysPerUser = 5;
        
        /**
         * 是否允许重复注册相同设备
         */
        private boolean allowDuplicateDevices = false;
        
        public int getMaxPasskeysPerUser() {
            return maxPasskeysPerUser;
        }
        
        public void setMaxPasskeysPerUser(int maxPasskeysPerUser) {
            this.maxPasskeysPerUser = maxPasskeysPerUser;
        }
        
        public boolean isAllowDuplicateDevices() {
            return allowDuplicateDevices;
        }
        
        public void setAllowDuplicateDevices(boolean allowDuplicateDevices) {
            this.allowDuplicateDevices = allowDuplicateDevices;
        }
    }
    
    /**
     * 会话配置
     */
    public static class Session {
        /**
         * 认证浼氳瘽过期鏃堕棿锛堝垎閽燂級
         */
        private int authSessionExpireMinutes = 30;
        
        /**
         * 鏄惁鍚敤浼氳瘽绠＄悊
         */
        private boolean enabled = true;
        
        public int getAuthSessionExpireMinutes() {
            return authSessionExpireMinutes;
        }
        
        public void setAuthSessionExpireMinutes(int authSessionExpireMinutes) {
            this.authSessionExpireMinutes = authSessionExpireMinutes;
        }
        
        public boolean isEnabled() {
            return enabled;
        }
        
        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }
    }
}
