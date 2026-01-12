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

package org.zeron.sophon.persistence.service.impl;

import java.util.Date;

import org.zeron.sophon.entity.passkey.PasskeyChallenge;
import org.zeron.sophon.persistence.mapper.PasskeyChallengeMapper;
import org.zeron.sophon.persistence.service.PasskeyChallengeService;
import org.dromara.mybatis.jpa.service.impl.JpaServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * PasskeyChallenge Service 瀹炵幇绫?
 * 鎻愪??Passkey 鎸戞垬鏁版嵁鐨勬暟鎹簱鎿嶄綔瀹炵??
 * 
 * @author Sophon Team
 */
@Repository
@Transactional
public class PasskeyChallengeServiceImpl extends JpaServiceImpl<PasskeyChallengeMapper, PasskeyChallenge> implements PasskeyChallengeService {
    
    private static final Logger _logger = LoggerFactory.getLogger(PasskeyChallengeServiceImpl.class);
    
    @Override
    public PasskeyChallenge findByChallengeId(String challengeId) {
        _logger.debug("Finding challenge by ID: {}", challengeId);
        try {
            return getMapper().findByChallengeId(challengeId);
        } catch (Exception e) {
            _logger.error("Error finding challenge by ID: {}", challengeId, e);
            throw new RuntimeException("Failed to find challenge by ID: " + challengeId, e);
        }
    }
    
    @Override
    public PasskeyChallenge findLatestByUserIdAndType(String userId, String challengeType) {
        _logger.debug("Finding latest challenge for user: {} and type: {}", userId, challengeType);
        try {
            return getMapper().findLatestByUserIdAndType(userId, challengeType);
        } catch (Exception e) {
            _logger.error("Error finding latest challenge for user: {} and type: {}", userId, challengeType, e);
            throw new RuntimeException("Failed to find latest challenge for user and type", e);
        }
    }
    
    @Override
    public boolean saveChallenge(PasskeyChallenge challenge) {
        _logger.debug("Saving challenge for user: {} and type: {}", challenge.getUserId(), challenge.getChallengeType());
        try {
            // 绉婚櫎閲嶅璁剧疆鍒涘缓鏃堕棿鐨勪唬鐮侊紝鍥犱负鏋勯€犲嚱鏁颁腑宸茬粡姝ｇ‘璁剧疆浜嗗垱寤烘椂闂村拰杩囨湡鏃堕??
            // challenge.setCreatedDate(new Date()); // 鍒犻櫎杩欒閬垮厤鏃堕棿鍐茬??
            
            // 娓呯悊璇ョ敤鎴峰悓绫诲瀷鐨勬棫鎸戞垬锛堜繚鎸佹暟鎹簱鏁存磥锛?
            deleteByUserIdAndType(challenge.getUserId(), challenge.getChallengeType());
            
            // 鎻掑叆鏂版寫??
            return insert(challenge);
        } catch (Exception e) {
            _logger.error("Error saving challenge for user: {}", challenge.getUserId(), e);
            throw new RuntimeException("Failed to save challenge", e);
        }
    }
    
    @Override
    public boolean deleteByChallengeId(String challengeId) {
        _logger.debug("Deleting challenge by ID: {}", challengeId);
        try {
            int result = getMapper().deleteByChallengeId(challengeId);
            return result > 0;
        } catch (Exception e) {
            _logger.error("Error deleting challenge by ID: {}", challengeId, e);
            throw new RuntimeException("Failed to delete challenge by ID: " + challengeId, e);
        }
    }
    
    @Override
    public int cleanExpiredChallenges() {
        _logger.debug("Cleaning expired challenges");
        try {
            int result = getMapper().cleanExpiredChallenges();
            _logger.info("Cleaned {} expired challenges", result);
            return result;
        } catch (Exception e) {
            _logger.error("Error cleaning expired challenges", e);
            throw new RuntimeException("Failed to clean expired challenges", e);
        }
    }
    
    @Override
    public int deleteByUserId(String userId) {
        _logger.debug("Deleting all challenges for user: {}", userId);
        try {
            int result = getMapper().deleteByUserId(userId);
            _logger.debug("Deleted {} challenges for user: {}", result, userId);
            return result;
        } catch (Exception e) {
            _logger.error("Error deleting challenges for user: {}", userId, e);
            throw new RuntimeException("Failed to delete challenges for user: " + userId, e);
        }
    }
    
    @Override
    public int deleteByUserIdAndType(String userId, String challengeType) {
        _logger.debug("Deleting challenges for user: {} and type: {}", userId, challengeType);
        try {
            int result = getMapper().deleteByUserIdAndType(userId, challengeType);
            _logger.debug("Deleted {} challenges for user: {} and type: {}", result, userId, challengeType);
            return result;
        } catch (Exception e) {
            _logger.error("Error deleting challenges for user: {} and type: {}", userId, challengeType, e);
            throw new RuntimeException("Failed to delete challenges for user and type", e);
        }
    }
    
    @Override
    public int countByUserId(String userId) {
        _logger.debug("Counting challenges for user: {}", userId);
        try {
            return getMapper().countByUserId(userId);
        } catch (Exception e) {
            _logger.error("Error counting challenges for user: {}", userId, e);
            throw new RuntimeException("Failed to count challenges for user: " + userId, e);
        }
    }
    
    @Override
    public boolean existsValidChallenge(String challengeId) {
        _logger.debug("Checking if valid challenge exists: {}", challengeId);
        try {
            return getMapper().existsValidChallenge(challengeId);
        } catch (Exception e) {
            _logger.error("Error checking valid challenge existence: {}", challengeId, e);
            throw new RuntimeException("Failed to check valid challenge existence", e);
        }
    }
    
    @Override
    public PasskeyChallenge validateAndConsumeChallenge(String challengeId, String expectedType) {
        _logger.debug("Validating and consuming challenge: {} with expected type: {}", challengeId, expectedType);
        try {
            // 鏌ユ壘鎸戞垬
            PasskeyChallenge challenge = findByChallengeId(challengeId);
            
            if (challenge == null) {
                _logger.warn("Challenge not found: {}", challengeId);
                return null;
            }
            
            // 妫€鏌ユ槸鍚﹁繃??
            if (challenge.getExpiresDate().before(new Date())) {
                _logger.warn("Challenge expired: {}", challengeId);
                // 鍒犻櫎杩囨湡鐨勬寫鎴?
                deleteByChallengeId(challengeId);
                return null;
            }
            
            // 妫€鏌ョ被鍨嬫槸鍚﹀尮閰?
            if (!expectedType.equals(challenge.getChallengeType())) {
                _logger.warn("Challenge type mismatch. Expected: {}, Actual: {}", expectedType, challenge.getChallengeType());
                return null;
            }
            
            // 楠岃瘉鎴愬姛锛屽垹闄ゆ寫鎴橈紙娑堣垂??
            deleteByChallengeId(challengeId);
            
            _logger.debug("Challenge validated and consumed successfully: {}", challengeId);
            return challenge;
        } catch (Exception e) {
            _logger.error("Error validating and consuming challenge: {}", challengeId, e);
            throw new RuntimeException("Failed to validate and consume challenge", e);
        }
    }
}
