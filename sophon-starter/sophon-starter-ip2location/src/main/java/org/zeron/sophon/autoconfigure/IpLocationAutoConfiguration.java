/*
 * Copyright [2025] [zeron of copyright http://www.zeron.com]
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
 

package org.zeron.sophon.autoconfigure;

import org.zeron.sophon.ip2location.IpLocation;
import org.zeron.sophon.ip2location.IpLocationParser;
import org.zeron.sophon.ip2location.offline.GeoIP2V4;
import org.zeron.sophon.ip2location.offline.Ip2regionV2;
import org.lionsoul.ip2region.xdb.Searcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StreamUtils;

import com.maxmind.geoip2.DatabaseReader;

/**
 * 
 * @author yi.min
 *
 */

@AutoConfiguration
public class IpLocationAutoConfiguration {
    static final  Logger _logger = LoggerFactory.getLogger(IpLocationAutoConfiguration.class);
    
    /**
     * Load Ip2Region offline database version 2.7.0
     * @return Ip2regionV2
     * @throws Exception
     */
    public Ip2regionV2 ip2regionV2() throws Exception {
        _logger.debug("IpRegion OffLine init...");
        ClassPathResource resource = new ClassPathResource("/ip2region/ip2region.xdb");
        byte[] dbBinStr = StreamUtils.copyToByteArray(resource.getInputStream());
        _logger.debug("ip2region length {}",dbBinStr.length);
        Searcher searcher = Searcher.newWithBuffer(dbBinStr);
        return new Ip2regionV2(searcher);
    }
    
    
    /**
     * Load GeoIP2 offline database version 4.0.1
     * @return GeoIp2V4
     * @throws Exception
     */
    public GeoIP2V4 geoIP2() throws Exception {
        _logger.debug("GeoIP2 OffLine init...");
        ClassPathResource resource = new ClassPathResource("/geoip2/GeoLite2-City.mmdb");
        DatabaseReader databaseReader = new DatabaseReader.Builder(resource.getInputStream()).build();
        return new GeoIP2V4(databaseReader);
    }
    
    /**
     * builder offline provider IpLocation
     * @param offlineProvider
     * @return IpLocation
     */
    public IpLocation builderOfflineProvider(String offlineProvider) {
        IpLocation ipLocationOffLine = null;
        try {
            if(offlineProvider.equalsIgnoreCase("none")) {
                //do nothing
                _logger.debug("IpLocation offline Provider none");
            }else if(offlineProvider.equalsIgnoreCase("Ip2Region")){
                ipLocationOffLine = ip2regionV2();
                _logger.debug("IpLocation offline Provider Ip2Region");
            }else if(offlineProvider.equalsIgnoreCase("GeoIp2")){
                ipLocationOffLine = geoIP2();
                _logger.debug("IpLocation offline Provider GeoIp2");
            }
        }catch(Exception e) {
            _logger.error("builder Offline IpLocation error", e);
        }
        return ipLocationOffLine;
    }
    

    
    /**
     * IP conversion region address resolution
     * @param isIplocation whether to convert
     * @param onlineProvider online conversion provider none/Ip138
     * @param offlineProvider offline conversion provider none/Ip2Region/GeoIp2
     * @return IpLocationParser
     * @throws Exception
     */
    @Bean 
    IpLocationParser ipLocationParser(
            @Value("${sophon.login.iplocation:true}") boolean isIplocation,
            @Value("${sophon.login.iplocation.online.provider:none}") String onlineProvider,
            @Value("${sophon.login.iplocation.offline.provider:Ip2Region}") String offlineProvider) throws Exception {
        return new IpLocationParser(
                isIplocation,
                null,
                builderOfflineProvider(offlineProvider)
        );
    }
    

}