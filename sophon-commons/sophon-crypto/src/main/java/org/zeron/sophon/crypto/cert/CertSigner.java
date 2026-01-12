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
 

package org.zeron.sophon.crypto.cert;

import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.util.Date;

import org.zeron.sophon.crypto.HexUtils;
import org.zeron.sophon.crypto.keystore.KeyStoreUtil;


/** *//**
 * <p>
 * 璇佷功鏁板瓧绛惧??
 * 
 * @version 1.0
 */
public class CertSigner {

    /** *//**
     * <p>
     * 鐢熸垚鏁版嵁绛惧??
     * </p>
     * 
     * @param data 婧愭暟锟?
     * @param keyStorePath 瀵嗛挜搴撳瓨鍌ㄨ矾锟?
     * @param alias x509Certificate alias
     * @param password 瀵嗛挜搴撳瘑??
     * @return
     * @throws Exception
     */
    public static byte[] sign(byte[] data, KeyStore keyStore, String alias, String password) throws Exception {
        // 鑾峰緱璇佷功
        X509Certificate x509Certificate = (X509Certificate) KeyStoreUtil.getCertificate(keyStore, alias, password);
        // 鍙栧緱绉侀??
        PrivateKey privateKey = (PrivateKey) keyStore.getKey(alias, password.toCharArray());
        // 鏋勫缓绛惧悕
        Signature signature = Signature.getInstance(x509Certificate.getSigAlgName());
        signature.initSign(privateKey);
        signature.update(data);
        return signature.sign();
    }
    
    
    /** *//**
     * <p>
     * 楠岃瘉绛惧悕
     * </p>
     * 
     * @param data 宸插姞瀵嗘暟锟?
     * @param sign 鏁版嵁绛惧悕[BASE64]
     * @param certificatePath 璇佷功瀛樺偍璺緞
     * @return
     * @throws Exception
     */
    public static boolean verifySign(byte[] data, String sign, X509Certificate certificate) 
            throws Exception {
        // 鑾峰緱鍏挜
        PublicKey publicKey = certificate.getPublicKey();
        // 鏋勫缓绛惧悕
        Signature signature = Signature.getInstance(certificate.getSigAlgName());
        signature.initVerify(publicKey);
        signature.update(data);
        return signature.verify(HexUtils.hex2Bytes(sign));
    }
    

    
    
    /** *//**
     * <p>
     * 鐢熸垚鏁版嵁绛惧悕骞朵互BASE64缂栫??
     * </p>
     * 
     * @param data 婧愭暟锟?
     * @param keyStorePath 瀵嗛挜搴撳瓨鍌ㄨ矾锟?
     * @param alias 瀵嗛挜搴撳埆??
     * @param password 瀵嗛挜搴撳瘑??
     * @return
     * @throws Exception
     */
    public static String sign2Hex(byte[] data, KeyStore keyStore, String alias, String password) 
            throws Exception {
        return HexUtils.bytes2HexString(sign(data, keyStore, alias, password));
    }
    

    /** *//**
     * <p>
     * BASE64瑙ｇ??>绛惧悕鏍￠獙
     * </p>
     * 
     * @param base64String BASE64缂栫爜瀛楃锟?
     * @param sign 鏁版嵁绛惧悕[BASE64]
     * @param certificatePath 璇佷功瀛樺偍璺緞
     * @return
     * @throws Exception
     */
    public static boolean verifyHexSign(String HexString, String sign, X509Certificate certificate) 
            throws Exception {
        byte[] data = HexUtils.hex2Bytes(HexString);
        return verifySign(data, sign, certificate);
    }
    
    /** *//**
     * <p>
     * 鐢熸垚鏂囦欢鏁版嵁绛惧悕(BASE64)
     * </p>
     * <p>
     * ??锟斤拷鍏堝皢鏂囦欢绉侀挜鍔犲瘑锛屽啀鏍规嵁鍔犲瘑鍚庣殑鏁版嵁鐢熸垚绛惧悕(BASE64)锛岋??鐢ㄤ簬灏忔枃??
     * </p>
     * 
     * @param filePath 婧愭枃锟?
     * @param keyStorePath 瀵嗛挜搴撳瓨鍌ㄨ矾锟?
     * @param alias 瀵嗛挜搴撳埆??
     * @param password 瀵嗛挜搴撳瘑??
     * @return
     * @throws Exception
     */
    public static String signFile2HexWithEncrypt(String filePath, KeyStore keyStore, String alias, String password)
            throws Exception {
        byte[] encryptedData = CertCrypto.encryptFileByPrivateKey(filePath, keyStore, alias, password);
        return sign2Hex(encryptedData, keyStore, alias, password);
    }
    

    

    

 
    
    /** *//**
     * <p>
     * BASE64瑙ｇ??>鍏挜瑙ｅ瘑-绛惧悕鏍￠獙
     * </p>
     * 
     * 
     * @param base64String BASE64缂栫爜瀛楃锟?
     * @param sign 鏁版嵁绛惧悕[BASE64]
     * @param certificatePath 璇佷功瀛樺偍璺緞
     * @return
     * @throws Exception
     */
    public static boolean verifyHexSignWithDecrypt(String hexString, String sign, X509Certificate certificate) 
            throws Exception {
        byte[] encryptedData = HexUtils.hex2Bytes(hexString);
        byte[] data = CertCrypto.decryptByPublicKey(encryptedData, certificate);
        return verifySign(data, sign, certificate);
    }
    

    /** *//**
     * <p>
     * 鏍￠獙璇佷功褰撳墠鏄惁鏈夋??
     * </p>
     * 
     * @param certificate 璇佷??
     * @return
     */
    public static boolean verifyCertificate(Certificate certificate) {
        return verifyCertificate(new Date(), certificate);
    }
    
    /** *//**
     * <p>
     * 楠岃瘉璇佷功鏄惁杩囨湡鎴栨棤锟?
     * </p>
     * 
     * @param date 鏃ユ??
     * @param certificate 璇佷??
     * @return
     */
    public static boolean verifyCertificate(Date date, Certificate certificate) {
        boolean isValid = true;
        try {
            X509Certificate x509Certificate = (X509Certificate) certificate;
            x509Certificate.checkValidity(date);
        } catch (Exception e) {
            isValid = false;
        }
        return isValid;
    }
    
    
    /** *//**
     * <p>
     * 楠岃瘉鏁板瓧璇佷功鏄湪缁欏畾鐨勬棩鏈熸槸鍚︽湁??
     * </p>
     * 
     * @param keyStorePath 瀵嗛挜搴撳瓨鍌ㄨ矾锟?
     * @param alias 瀵嗛挜搴撳埆??
     * @param password 瀵嗛挜搴撳瘑??
     * @return
     */
    public static boolean verifyCertificate(Date date,KeyStore keyStore, String alias, String password) {
        Certificate certificate;
        try {
            certificate = KeyStoreUtil.getCertificate(keyStore, alias, password);
            return verifyCertificate(certificate);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /** *//**
     * <p>
     * 楠岃瘉鏁板瓧璇佷功褰撳墠鏄惁鏈夋晥
     * </p>
     * 
     * @param keyStorePath 瀵嗛挜搴撳瓨鍌ㄨ矾锟?
     * @param alias 瀵嗛挜搴撳埆??
     * @param password 瀵嗛挜搴撳瘑??
     * @return
     */
    public static boolean verifyCertificate(KeyStore keyStore, String alias, String password) {
        return verifyCertificate(new Date(), keyStore, alias, password);
    }
    
}

