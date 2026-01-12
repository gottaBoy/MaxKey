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
 

package org.zeron.sophon.crypto.signature;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

import org.zeron.sophon.crypto.Base64Utils;
import org.zeron.sophon.crypto.KeyPairType;



/**
 * DSA Digital signature
 * default signature  algorithm is SHA1withDSA
 * default key size is 1024
 * DsaSigner support SHA1withDSA
 * @author yi.min
 *
 */
public final class DsaSigner implements ISigner {

    // 锟斤拷锟斤拷签锟斤拷锟斤拷钥锟姐??
    public static final KeyPairType KEY_ALGORITHM = KeyPairType.DSA;

    /**
     * 锟斤拷锟斤拷签锟斤拷 签锟斤拷/锟斤拷证锟姐??
     * */
    public static final String SIGNATURE_ALGORITHM = "SHA1withDSA";

    @Override
    public  byte[] sign(byte[] dataBytes, byte[] privateKeyByte) throws Exception {
        // 取锟斤拷私钥
        PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(privateKeyByte);
        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM.name());
        // 锟斤拷锟剿皆?
        PrivateKey signPrivateKey = keyFactory.generatePrivate(pkcs8KeySpec);
        // 实锟斤拷Signature
        Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
        // 锟斤拷始锟斤拷Signature
        signature.initSign(signPrivateKey);
        // 锟斤拷锟斤拷
        signature.update(dataBytes);

        return signature.sign();
    }
    
    @Override
    public  String signB64(String data, String privateKey) throws Exception {
        
        byte[] privateKeyByte = Base64Utils.decoder(privateKey);
        byte[] dataBytes = data.getBytes();    
        
        byte[] signatureBytes=sign(dataBytes,privateKeyByte);

        return Base64Utils.encoder(signatureBytes);
    }

    @Override
    public boolean verify(byte[] dataBytes, byte[] publicKeyBytes, byte[] signBytes)throws Exception {

        KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM.name());
        // 锟斤拷始锟斤拷锟斤拷??
        // 锟斤拷钥锟斤拷锟斤拷转锟斤拷
        X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(publicKeyBytes);
        // 锟斤拷锟斤拷??
        PublicKey verifyPublicKey = keyFactory.generatePublic(x509KeySpec);
        // 实锟斤拷Signature
        Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
        // 锟斤拷始锟斤拷Signature
        signature.initVerify(verifyPublicKey);
        // 锟斤拷锟斤拷
        signature.update(dataBytes);
        // 锟斤拷证
        return signature.verify(signBytes);
    }
    
    @Override
    public boolean verifyB64(String data, String publicKey, String sign)throws Exception {

        byte[] privateKeyByte = Base64Utils.decoder(publicKey);
        byte[] dataBytes = data.getBytes();
        byte[] signBytes=Base64Utils.decoder(sign);
        
        // 锟斤拷证
        return verify(dataBytes,privateKeyByte,signBytes);
    }

}

