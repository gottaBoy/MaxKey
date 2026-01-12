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

package org.zeron.sophon.persistence.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.zeron.sophon.entity.passkey.UserPasskey;
import org.dromara.mybatis.jpa.IJpaMapper;

/**
 * UserPasskey Mapper 接口
 * 提供用户 Passkey 鍑嵁的勬暟鎹簱操作方??
 * 
 * @author Sophon Team
 */
public interface UserPasskeyMapper extends IJpaMapper<UserPasskey> {
    
    /**
     * 根据用户ID查询鎵€鏈塒asskey鍑??
     * 
     * @param userId 用户ID
     * @return Passkey鍑嵁列??
     */
    @Select("SELECT * FROM ze_user_passkeys WHERE user_id = #{userId} AND status = 1 ORDER BY created_date DESC")
    @Results({
        @Result(column = "id", property = "id"),
        @Result(column = "user_id", property = "userId"),
        @Result(column = "credential_id", property = "credentialId"),
        @Result(column = "public_key", property = "publicKey"),
        @Result(column = "signature_count", property = "signatureCount"),
        @Result(column = "aaguid", property = "aaguid"),
        @Result(column = "display_name", property = "displayName"),
        @Result(column = "device_type", property = "deviceType"),
        @Result(column = "created_date", property = "createdDate"),
        @Result(column = "last_used_date", property = "lastUsedDate"),
        @Result(column = "status", property = "status"),
        @Result(column = "inst_id", property = "instId")
    })
    List<UserPasskey> findByUserId(String userId);
    
    /**
     * 根据鍑嵁ID查询Passkey
     * 
     * @param credentialId 鍑嵁ID锛圔ase64编码??
     * @return UserPasskey对象
     */
    @Select("SELECT * FROM ze_user_passkeys WHERE credential_id = #{credentialId} AND status = 1")
    @Results({
        @Result(column = "id", property = "id"),
        @Result(column = "user_id", property = "userId"),
        @Result(column = "credential_id", property = "credentialId"),
        @Result(column = "public_key", property = "publicKey"),
        @Result(column = "signature_count", property = "signatureCount"),
        @Result(column = "aaguid", property = "aaguid"),
        @Result(column = "display_name", property = "displayName"),
        @Result(column = "device_type", property = "deviceType"),
        @Result(column = "created_date", property = "createdDate"),
        @Result(column = "last_used_date", property = "lastUsedDate"),
        @Result(column = "status", property = "status"),
        @Result(column = "inst_id", property = "instId")
    })
    UserPasskey findByCredentialId(String credentialId);
    
    /**
     * 根据用户ID和凭据ID查询Passkey
     * 
     * @param userId 用户ID
     * @param credentialId 鍑嵁ID
     * @return UserPasskey对象
     */
    @Select("SELECT * FROM ze_user_passkeys WHERE user_id = #{userId} AND credential_id = #{credentialId} AND status = 1")
    @Results({
        @Result(column = "id", property = "id"),
        @Result(column = "user_id", property = "userId"),
        @Result(column = "credential_id", property = "credentialId"),
        @Result(column = "public_key", property = "publicKey"),
        @Result(column = "signature_count", property = "signatureCount"),
        @Result(column = "aaguid", property = "aaguid"),
        @Result(column = "display_name", property = "displayName"),
        @Result(column = "device_type", property = "deviceType"),
        @Result(column = "created_date", property = "createdDate"),
        @Result(column = "last_used_date", property = "lastUsedDate"),
        @Result(column = "status", property = "status"),
        @Result(column = "inst_id", property = "instId")
    })
    UserPasskey findByUserIdAndCredentialId(@Param("userId") String userId, @Param("credentialId") String credentialId);
    
    /**
     * 更新签名璁℃暟鍣?
     * 
     * @param credentialId 鍑嵁ID
     * @param signatureCount 鏂扮殑签名璁℃暟
     * @return 更新的勮褰曟暟
     */
    @Update("UPDATE ze_user_passkeys SET signature_count = #{signatureCount}, last_used_date = NOW() WHERE credential_id = #{credentialId}")
    int updateSignatureCount(@Param("credentialId") String credentialId, @Param("signatureCount") Long signatureCount);
    
    /**
     * 鐗╃悊删除Passkey
     * 
     * @param userId 用户ID
     * @param credentialId 鍑嵁ID
     * @return 删除的勮褰曟暟
     */
    @Delete("DELETE FROM ze_user_passkeys WHERE user_id = #{userId} AND credential_id = #{credentialId}")
    int deleteByUserIdAndCredentialId(@Param("userId") String userId, @Param("credentialId") String credentialId);
    
    /**
     * 鐗╃悊删除过期的凱asskey记录
     * 
     * @return 删除的勮褰曟暟
     */
    @Delete("DELETE FROM ze_user_passkeys WHERE status = 0 AND created_date < DATE_SUB(NOW(), INTERVAL 30 DAY)")
    int cleanExpiredPasskeys();
    
    /**
     * 统计用户的凱asskey数量
     * 
     * @param userId 用户ID
     * @return Passkey数量
     */
    @Select("SELECT COUNT(*) FROM ze_user_passkeys WHERE user_id = #{userId} AND status = 1")
    int countByUserId(String userId);
    
    /**
     * 妫€鏌ュ嚟鎹甀D鏄惁已存在?
     * 
     * @param credentialId 鍑嵁ID
     * @return 鏄惁存??
     */
    @Select("SELECT COUNT(*) > 0 FROM ze_user_passkeys WHERE credential_id = #{credentialId} AND status = 1")
    boolean existsByCredentialId(String credentialId);
}
