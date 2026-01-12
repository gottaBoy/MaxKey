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
 

package org.zeron.sophon.persistence.service;

import java.util.List;

import org.zeron.sophon.entity.Accounts;
import org.zeron.sophon.entity.AccountsStrategy;
import org.zeron.sophon.entity.idm.UserInfo;
import org.dromara.mybatis.jpa.service.IJpaService;

public interface AccountsService  extends IJpaService<Accounts>{

   public boolean updateStatus(Accounts accounts) ;
   
   public boolean remove(String id) ;
   
   public void refreshByStrategy(AccountsStrategy strategy) ;
   
   public void refreshAllByStrategy() ;
   
   public List<UserInfo> queryUserNotInStrategy(AccountsStrategy strategy);
   
   public long deleteByStrategy(AccountsStrategy strategy) ;
    
   public List<Accounts> queryByAppIdAndDate(Accounts account) ;
   
   public List<Accounts> queryByAppIdAndAccount(String appId,String relatedUsername);
   
   public String generateAccount(UserInfo  userInfo,AccountsStrategy accountsStrategy) ;
  
    
}

