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
 

package org.Sophon.util;

import java.util.HashMap;

import org.zeron.sophon.util.ObjectTransformer;

public class ObjectTransformerTest {

    /**
     * @param args
     */
    public static void main(String[] args) {
        HashMap<String, Object> ut=new HashMap<String, Object>();
        
        ut.put("username","shimingxy");
        ut.put("password","test");
        ut.put("department","鎴戠殑閮ㄩ棬");
        
        String hexString =ObjectTransformer.serialize(ut);
        
        System.out.println("hexString "+hexString);
        System.out.println(hexString.length());
        
        HashMap<String, Object> u2=ObjectTransformer.deserialize(hexString);
        
        System.out.println("deserialize "+u2.toString());
        
        System.out.println("{鈥檌d??鈥檅e90f66d-95df-4daf-93c1-ece002542702??鈥檛id??null,鈥檛name??null,鈥檇escription??null,鈥檚tatus??0,鈥檚ortOrder??0,鈥檆reatedBy??鈥檃dmin??鈥檆reatedDate????014-11-07 21:27:38??鈥檓odifiedBy??null,鈥檓odifiedDate??null,鈥檚tartDate??null,鈥檈ndDate??null,鈥檜sername??鈥檡yyyy??鈥檖assword??鈥橮t3dCf6Zad9h3g7q/DI0e7jQ5evO2Jn+tk2TjtdJ0eY=??鈥檇ecipherable??鈥檡aOLYlcdjfF5hFOskBOOxQ==??鈥檚haredSecret??null,鈥檚haredCounter??null,鈥檜serType??鈥橢MPLOYEE??鈥檞indowsAccount??null,鈥檇isplayName??鈥檛est??鈥檔ickName??null,鈥檔ameZHSpell??鈥檛est??鈥檔ameZHShortSpell??鈥檛est??鈥檊ivenName??null,鈥檓iddleName??null,鈥檉amilyName??null,鈥檋onorificPrefix??null,鈥檋onorificSuffix??null,鈥檉ormattedName??null,鈥檓arried??0,鈥檊ender??1,鈥檅irthDate??null,鈥檌dType??0,鈥檌dCardNo??null,鈥檞ebSite??null,鈥檚tartWorkDate??null,鈥檃uthnType??0,鈥檈mail??null,鈥檈mailVerified??0,鈥檓obile??null,鈥檓obileVerified??0,鈥檖asswordQuestion??null,鈥檖asswordAnswer??null,鈥檃ppLoginAuthnType??0,鈥檃ppLoginPassword??null,鈥檖rotectedApps??null,鈥檖asswordLastSetTime????014-11-07 21:27:38??鈥檅adPasswordCount??0,鈥檜nLockTime??null,鈥檌sLocked??0,鈥檒astLoginTime??null,鈥檒astLogoffTime??null,鈥檖asswordSetType??0,鈥檒ocale??鈥檢h_CN??鈥檛imeZone??鈥橝sia/Shanghai??鈥檖referredLanguage??鈥檢h_CN??鈥檞orkCountry??鈥機HN??鈥檞orkRegion??null,鈥檞orkLocality??null,鈥檞orkStreetAddress??null,鈥檞orkAddressFormatted??null,鈥檞orkEmail??null,鈥檞orkPhoneNumber??null,鈥檞orkPostalCode??null,鈥檞orkFax??null,鈥檋omeCountry??鈥機HN??鈥檋omeRegion??null,鈥檋omeLocality??null,鈥檋omeStreetAddress??null,鈥檋omeAddressFormatted??null,鈥檋omeEmail??null,鈥檋omePhoneNumber??null,鈥檋omePostalCode??null,鈥檋omeFax??null,鈥檈mployeeNumber??null,鈥檆ostCenter??null,鈥檕rganization??null,鈥檇ivision??null,鈥檇epartmentId??null,鈥檇epartment??null,鈥檍obTitle??null,鈥檍obLevel??null,鈥檓anagerId??null,鈥檓anager??null,鈥檃ssistantId??null,鈥檃ssistant??null,鈥檈ntryDate??null,鈥檘uitDate??null,鈥檌ms??鈥橯Q:\r\nWeiXin:\r\nSinaWeibo:\r\nGtalk:\r\nYiXin:\r\nIMessage:\r\nSkype:\r\nYahoo:\r\nMSN:\r\nAim:\r\nICQ :\r\nXmpp :??鈥檈xtraAttribute??null,鈥檈xtraAttributeName??null,鈥檈xtraAttributeValue??null,鈥檕nline??0,鈥檒dapDn??null}".length());
    }

}

