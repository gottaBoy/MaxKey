/*
 * Copyright [2024] [Sophon of copyright http://www.sophon.console]
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

import java.util.List;

import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.entity.permissions.RoleMember;
import org.zeron.sophon.entity.permissions.Roles;
import org.zeron.sophon.persistence.mapper.RoleMemberMapper;
import org.zeron.sophon.persistence.service.RoleMemberService;
import org.dromara.mybatis.jpa.entity.JpaPageResults;
import org.dromara.mybatis.jpa.service.impl.JpaServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

@Repository
public class RoleMemberServiceImpl  extends JpaServiceImpl<RoleMemberMapper,RoleMember> implements RoleMemberService{
    static final  Logger _logger = LoggerFactory.getLogger(RoleMemberServiceImpl.class);

    public int addDynamicRoleMember(Roles dynamicGroup) {
        return getMapper().addDynamicRoleMember(dynamicGroup);
    }
    
    public int deleteDynamicRoleMember(Roles dynamicGroup) {
        return getMapper().deleteDynamicRoleMember(dynamicGroup);
    }
    
    public int deleteByRoleId(String groupId) {
        return getMapper().deleteByRoleId(groupId);
    }
    
    public List<UserInfo> queryMemberByRoleId(String groupId){
        return getMapper().queryMemberByRoleId(groupId);
    }
    
    @Override
    public List<RoleMember> queryRoleMembers(String roleId) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<RoleMember> queryMemberByRoleIds(List<String> roleIds) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<RoleMember> queryRoleMember(RoleMember roleMember) {
        return getMapper().queryRoleMember(roleMember);
    }
    
    public JpaPageResults<Roles> rolesNoMember(RoleMember entity) {
        entity.build();
        List<Roles> resultslist = null;
        try {
            resultslist = getMapper().rolesNoMember(entity);
        } catch (Exception e) {
            _logger.error("fetchPageResults Exception " , e);
        }
        //褰撳墠椤佃褰曟??
        Integer records = JpaPageResults.parseRecords(resultslist);
        //鎬婚〉鏁?
        Integer totalCount =fetchCount(entity, resultslist);
        return new JpaPageResults<Roles>(entity.getPageNumber(),entity.getPageSize(),records,totalCount,resultslist);
    }
    
}

