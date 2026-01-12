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

package org.zeron.sophon.persistence.service;

import java.util.List;

import org.zeron.sophon.entity.passkey.UserPasskey;
import org.dromara.mybatis.jpa.service.IJpaService;

/**
 * UserPasskey Service 接口
 * 提供用户 Passkey 鍑嵁的勪笟鍔℃搷浣滄柟??
 * 
 * @author Sophon Team
 */
public interface UserPasskeyService extends IJpaService<UserPasskey> {
    
    /**
     * 根据用户ID查询鎵€鏈塒asskey鍑??
     * 
     * @param userId 用户ID
     * @return Passkey鍑嵁列??
     */
    List<UserPasskey> findByUserId(String userId);
    
    /**
     * 根据鍑嵁ID查询Passkey
     * 
     * @param credentialId 鍑嵁ID锛圔ase64编码??
     * @return UserPasskey对象
     */
    UserPasskey findByCredentialId(String credentialId);
    
    /**
     * 根据用户ID鍜屽嚟鎹甀D查询Passkey
     * 
     * @param userId 用户ID
     * @param credentialId 鍑嵁ID
     * @return UserPasskey对象
     */
    UserPasskey findByUserIdAndCredentialId(String userId, String credentialId);
    
    /**
     * 保存或更新癙asskey鍑??
     * 
     * @param userPasskey Passkey鍑嵁对??
     * @return 鏄惁成??
     */
    boolean saveOrUpdatePasskey(UserPasskey userPasskey);
    
    /**
     * 更新签名璁℃暟鍣?
     * 
     * @param credentialId 鍑嵁ID
     * @param signatureCount 鏂扮殑签名璁℃暟
     * @return 鏄惁成??
     */
    boolean updateSignatureCount(String credentialId, Long signatureCount);
    
    /**
     * 删除用户的凱asskey鍑??
     * 
     * @param userId 用户ID
     * @param credentialId 鍑嵁ID
     * @return 鏄惁成??
     */
    boolean deletePasskey(String userId, String credentialId);
    
    /**
     * 清理过期的凱asskey记录
     * 
     * @return 清理的勮褰曟暟
     */
    int cleanExpiredPasskeys();
    
    /**
     * 统计用户的凱asskey数量
     * 
     * @param userId 用户ID
     * @return Passkey数量
     */
    int countByUserId(String userId);
    
    /**
     * 妫€鏌ュ嚟鎹甀D鏄惁已存在?
     * 
     * @param credentialId 鍑嵁ID
     * @return 鏄惁存??
     */
    boolean existsByCredentialId(String credentialId);
    
    /**
     * 获取用户的凱asskey统计淇℃伅
     * 
     * @param userId 用户ID
     * @return 统计淇℃伅Map
     */
    java.util.Map<String, Object> getPasskeyStats(String userId);
}
