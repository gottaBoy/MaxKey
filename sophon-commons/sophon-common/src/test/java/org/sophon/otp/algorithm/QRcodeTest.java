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


package org.sophon.otp.algorithm;

import java.io.File;

import org.zeron.sophon.util.QRCode;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;


/**
 * VCARD
 */
public class QRcodeTest {

      // Encoding
    public static void main(String[] args) {
        try {

             String str = """
                         BEGIN:VCARD
                            VERSION:3.0
                            N:ShiMing
                            EMAIL:shimh@qq.com
                            TEL:15618726256
                            TEL;CELL:12345678912
                            ADR:Shanghai
                            ORG:
                            Connsec
                            TITLE:Technical Director
                            URL:http://blog.csdn.net/lidew521
                            NOTE:Test Note
                         END:VCARD
                     """;

             String str1 = """
                         BEGIN:VCARD
                             VERSION:3.0
                             N:Gump;Forrest;;Mr.
                             ORG:Bubba Gump Shrimp Co.
                             TITLE:Shrimp Man
                             TEL;TYPE=WORK,VOICE:(111) 555-12121
                             ADR;TYPE=WORK:;;100 Waters Edge;Baytown;LA;30314;United States of America      
                             EMAIL;TYPE=PREF,INTERNET:forrestgump@example.com
                             URL:http://www.johndoe.com
                             GENDER:F
                             REV:2008-04-24T19:52:43Z
                        END:VCARD
                     """;

             System.out.println(str);
            //String str = "CN:??COP:Company;ZW:Role";// 
            String path = "D:\\hwy.png";
            BitMatrix byteMatrix;
            byteMatrix = new MultiFormatWriter().encode(new String(str1.getBytes("UTF-8"),"iso-8859-1"), BarcodeFormat.QR_CODE, 300, 300);
            File file = new File(path);

            QRCode.writeToPath(byteMatrix, "png", file);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}