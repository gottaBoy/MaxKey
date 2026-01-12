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


package org.sophon.crypto;
import java.io.FileInputStream;
import java.io.ObjectInputStream;
import java.security.Key;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

import javax.crypto.Cipher;


/**
* RSA Encryption and Signing Test
*
* @author Administrator
*
*/
public class RsaMessage {

    public static void main(String[] args) throws Exception {
        String str = "hello, this is a test string";
        System.out.println("Original: " + str);

        RsaMessage rsa = new RsaMessage();
        // Assuming these files exist, or this test will fail at runtime, but compilation should pass.
        // If sk.dat/pk.dat are missing, that's a runtime error, not compilation.
        try {
            RSAPrivateKey privateKey = (RSAPrivateKey) rsa.readFromFile("sk.dat");
            RSAPublicKey publickKey = (RSAPublicKey) rsa.readFromFile("pk.dat");
    
            byte[] encbyte = rsa.encrypt(str, privateKey);
            System.out.println("Private Key Encrypted:");
            String encStr = toHexString(encbyte);
            System.out.println(encStr);
    
            byte[] signBytes = rsa.sign(str, privateKey);
            System.out.println("Signature Value:");
            String signStr = toHexString(signBytes);
            System.out.println(signStr);
    
            byte[] decByte = rsa.decrypt(encStr, publickKey);
            System.out.println("Public Key Decrypted:");
            String decStr = new String(decByte);
            System.out.println(decStr);
    
            if (rsa.verifySign(str, signStr, publickKey)) {
                System.out.println("rsa sign check success");
            } else {
                System.out.println("rsa sign check failure");
            }
        } catch(java.io.FileNotFoundException e) {
             System.out.println("Key files not found, skipping runtime part.");
        }
    }

    /**
    * Encrypt
    */
    public byte[] encrypt(String message, Key key) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        return cipher.doFinal(message.getBytes());
    }

    /**
    * Decrypt
    */
    public byte[] decrypt(String message, Key key) throws Exception {
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, key);
        return cipher.doFinal(toBytes(message));
    }

    /**
    * Sign
    */
    public byte[] sign(String message, PrivateKey key) throws Exception {
        Signature signetcheck = Signature.getInstance("MD5withRSA");
        signetcheck.initSign(key);
        signetcheck.update(message.getBytes("ISO-8859-1"));
        return signetcheck.sign();
    }

    /**
    * Verify Signature
    */
    public boolean verifySign(String message, String signStr, PublicKey key) throws Exception {
        if (message == null || signStr == null || key == null) {
            return false;
        }
        Signature signetcheck = Signature.getInstance("MD5withRSA");
        signetcheck.initVerify(key);
        signetcheck.update(message.getBytes("ISO-8859-1"));
        return signetcheck.verify(toBytes(signStr));
    }

    /**
    * Read Object
    */
    private Object readFromFile(String fileName) throws Exception {
        ObjectInputStream input = new ObjectInputStream(new FileInputStream(fileName));
        Object obj = input.readObject();
        input.close();
        return obj;
    }

    public static String toHexString(byte[] b) {
        StringBuilder sb = new StringBuilder(b.length * 2);
        for (int i = 0; i < b.length; i++) {
            sb.append(HEXCHAR[(b[i] & 0xf0) >>> 4]);
            sb.append(HEXCHAR[b[i] & 0x0f]);
        }
        return sb.toString();
    }

    public static final byte[] toBytes(String s) {
        byte[] bytes;
        bytes = new byte[s.length() / 2];
        for (int i = 0; i < bytes.length; i++) {
            bytes[i] = (byte) Integer.parseInt(s.substring(2 * i, 2 * i + 2), 16);
        }
        return bytes;
    }

    private static char[] HEXCHAR = { '0', '1', '2', '3', '4', '5', '6', '7',
    '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };
}