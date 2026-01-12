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
 

/**
 * 
 */
package org.zeron.sophon.persistence.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Update;
import org.zeron.sophon.entity.apps.Apps;
import org.zeron.sophon.entity.apps.UserApps;
import org.dromara.mybatis.jpa.IJpaMapper;

/**
 * @author yi.min
 *
 */
public  interface AppsMapper extends IJpaMapper<Apps> {
    
    public int insertApp(Apps app);
    
    public int updateApp(Apps app);
    
    @Update("update ze_apps set extendattr=#{extendAttr} where id = #{id}")
    public int updateExtendAttr(Apps app);  
    

    public List<UserApps> queryMyApps(UserApps userApplications);
}

