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
 

package org.zeron.sophon.crypto;

import java.util.Arrays;

import org.bouncycastle.crypto.digests.SM3Digest;
import org.bouncycastle.crypto.macs.HMac;
import org.bouncycastle.crypto.params.KeyParameter;

/**
 * SM3.
 * @author yi.min
 *
 */
public class SM3 {
    /**
             * 璁＄畻SM3鎽樿鍊?
     *
     * @param simple 鍘熸??
     * @return 鎽樿鍊硷紝瀵逛簬SM3绠楁硶鏉ヨ??2瀛楄??
     */
    public static byte[] encode(byte[] simple) {
        SM3Digest digest = new SM3Digest();
        digest.update(simple, 0, simple.length);
        byte[] hash = new byte[digest.getDigestSize()];
        digest.doFinal(hash, 0);
        return hash;
    }

    /**
             *   楠岃瘉鎽樿
     *
     * @param simple 鍘熸??
     * @param cipher 鎽樿鍊?
     * @return 杩斿洖true鏍囪瘑楠岃瘉鎴愬姛锛宖alse鏍囪瘑楠岃瘉澶辫??
     */
    public static boolean verify(byte[] simple, byte[] cipher) {
        byte[] newHash = encode(simple);
        if (Arrays.equals(newHash, cipher)) {
            return true;
        } else {
            return false;
        }
    }

    /**
             *   璁＄畻SM3 Mac??
     *
     * @param key     key鍊硷紝鍙互鏄换鎰忛暱搴︾殑瀛楄妭鏁扮粍
     * @param srcData 鍘熸??
     * @return Mac鍊硷紝瀵逛簬HMac-SM3鏉ヨ鏄?2瀛楄??
     */
    public static byte[] hmac(byte[] key, byte[] simple) {
        KeyParameter keyParameter = new KeyParameter(key);
        SM3Digest digest = new SM3Digest();
        HMac mac = new HMac(digest);
        mac.init(keyParameter);
        mac.update(simple, 0, simple.length);
        byte[] result = new byte[mac.getMacSize()];
        mac.doFinal(result, 0);
        return result;
    }
}

