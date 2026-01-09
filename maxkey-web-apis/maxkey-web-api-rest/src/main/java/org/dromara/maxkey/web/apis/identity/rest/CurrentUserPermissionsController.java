/*
 * Copyright [2024] [MaxKey of copyright http://www.maxkey.top]
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
 

package org.dromara.maxkey.web.apis.identity.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.dromara.maxkey.authn.web.AuthorizationUtils;
import org.dromara.maxkey.entity.Message;
import org.dromara.maxkey.entity.idm.UserInfo;
import org.dromara.maxkey.entity.permissions.Resources;
import org.dromara.maxkey.entity.permissions.RoleMember;
import org.dromara.maxkey.entity.idm.GroupMember;
import org.dromara.maxkey.entity.idm.UserInfo;
import org.dromara.maxkey.persistence.service.GroupMemberService;
import org.dromara.maxkey.persistence.service.ResourcesService;
import org.dromara.maxkey.persistence.service.RoleMemberService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/idm/current/permissions")
public class CurrentUserPermissionsController {
    
    static final Logger logger = LoggerFactory.getLogger(CurrentUserPermissionsController.class);
    
    @Autowired
    RoleMemberService roleMemberService;
    
    @Autowired
    GroupMemberService groupMemberService;
    
    @Autowired
    ResourcesService resourcesService;
    
    @GetMapping("/menus")
    public Message<List<Resources>> currentUserMenus(@RequestParam(required = false) String appId) {
        UserInfo userInfo = AuthorizationUtils.getUserInfo();
        if(userInfo == null) {
            return new Message<>(Message.FAIL, "User not authenticated");
        }
        
        String instId = userInfo.getInstId();
        String userId = userInfo.getId();
        
        logger.debug("Querying menus for user {} in inst {}", userId, instId);
        
        // 1. Get Roles for User in this Institution
        RoleMember roleQuery = new RoleMember();
        roleQuery.setInstId(instId);
        roleQuery.setMemberId(userId);
        List<RoleMember> roles = roleMemberService.queryRoleMember(roleQuery);
        
         List<String> roleIds = new ArrayList<>();
        if (roles != null && !roles.isEmpty()) {
            roleIds = roles.stream()
                    .map(RoleMember::getRoleId)
                    .collect(Collectors.toList());
        }

        // 2. Get Group IDs for User
        GroupMember groupQuery = new GroupMember();
        groupQuery.setInstId(instId);
        groupQuery.setMemberId(userId);
        List<GroupMember> groups = groupMemberService.query(groupQuery);
        
        List<String> groupIds = new ArrayList<>();
        if (groups != null && !groups.isEmpty()) {
            groupIds = groups.stream()
                     .map(GroupMember::getGroupId)
                     .collect(Collectors.toList());
        }
        
        // 3. Get Resources for both Roles and Groups
        List<Resources> resources = new ArrayList<>();
        if (!roleIds.isEmpty() || !groupIds.isEmpty()) {
             resources = resourcesService.queryResourcesByRoleAndGroupIds(roleIds, groupIds);
        } else {
             resources = new ArrayList<>();
        }
        
        // 4. Filter by AppId if provided
        if (appId != null && !appId.isEmpty()) {
            resources = resources.stream()
                    .filter(r -> appId.equals(r.getAppId()))
                    .collect(Collectors.toList());
        }
        
        return new Message<>(resources);
    }
}
