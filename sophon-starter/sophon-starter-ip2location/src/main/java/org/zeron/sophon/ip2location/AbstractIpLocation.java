package org.zeron.sophon.ip2location;

/**
 * IpRegion转换抽象类，获取地址Location
 * 
 * @author yi.min
 *
 */
public abstract class AbstractIpLocation implements IpLocation{

    int failCount = 0;
    
    @Override
    public int getFailCount() {
        return failCount;
    };
    
    @Override
    public int plusFailCount() {
        return failCount++;
    };
    
    @Override
    public String getLocation(String region) {
        if(region.endsWith("电信") || region.endsWith("移动") || region.endsWith("联通")) {
            region = region.substring(0, region.length() - 2).trim();
        }
        
        if(region.indexOf(" ") > 0) {
            return region.split(" ")[0];
        }
        
        return region;
    }
}
