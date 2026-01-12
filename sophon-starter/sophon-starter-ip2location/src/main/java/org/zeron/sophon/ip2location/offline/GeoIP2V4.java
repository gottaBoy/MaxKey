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
package org.zeron.sophon.ip2location.offline;

import java.io.IOException;
import java.net.InetAddress;

import org.zeron.sophon.ip2location.AbstractIpLocation;
import org.zeron.sophon.ip2location.IpLocation;
import org.zeron.sophon.ip2location.Region;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.exception.GeoIp2Exception;
import com.maxmind.geoip2.model.CityResponse;

public class GeoIP2V4  extends AbstractIpLocation implements IpLocation{
    
    DatabaseReader databaseReader;
    
    public GeoIP2V4(DatabaseReader databaseReader) {
        this.databaseReader = databaseReader;
    }

    @Override
    public Region region(String ipAddress) {
        try {
            //瑙ｆ瀽IP鍦板??
            InetAddress inetAddress = InetAddress.getByName(ipAddress);
            // 鑾峰彇鏌ヨ缁撴??
            CityResponse response = databaseReader.city(inetAddress);
            // 鑾峰彇鍥藉淇℃??
            String country = response.getCountry().getNames().get("zh-CN");
            // 鑾峰彇鐪佷唤/??
            String state = response.getMostSpecificSubdivision().getNames().get("zh-CN");
            // 鑾峰彇鍩庡競
            String city = response.getCity().getNames().get("zh-CN");
            return new Region(country , state , city , country +" " + state + " " + city);
        } catch (IOException | GeoIp2Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}

