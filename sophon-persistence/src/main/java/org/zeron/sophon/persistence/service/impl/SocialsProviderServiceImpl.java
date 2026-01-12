/*
 * Copyright [2021] [Sophon of copyright http://www.sophon.console]
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

import org.zeron.sophon.entity.SocialsProvider;
import org.zeron.sophon.persistence.mapper.SocialsProviderMapper;
import org.zeron.sophon.persistence.service.SocialsProviderService;
import org.dromara.mybatis.jpa.service.impl.JpaServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

@Repository
public class SocialsProviderServiceImpl  extends JpaServiceImpl<SocialsProviderMapper,SocialsProvider> implements SocialsProviderService{
    static final  Logger _logger = LoggerFactory.getLogger(SocialsProviderServiceImpl.class);
    
}

