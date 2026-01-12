/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.shenyu.plugin.Sophon.config;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

class SophonConfigTest {

    @Test
    public void SophonConfig() {

        SophonConfig SophonConfig = new SophonConfig("a", "b", "c", "d", "e", "f", "g", "h", "i", false, "j", false, "k", "l", "m");
        assertEquals("a", SophonConfig.getClientId());
        assertEquals("b", SophonConfig.getClientSecret());
        assertEquals("c", SophonConfig.getAuthorizationEndpoint());
        assertEquals("d", SophonConfig.getScope());
        assertEquals("e", SophonConfig.getResponseType());
        assertEquals("f", SophonConfig.getRedirectUrl());
        assertEquals("g", SophonConfig.getRealm());
        assertEquals("h", SophonConfig.getGrantType());
        assertEquals("i", SophonConfig.getTokenEndpoint());
        assertFalse(SophonConfig.isBearerOnly());
        assertEquals("j", SophonConfig.getIntrospectionEndpoint());
        assertFalse(SophonConfig.isSetUserInfoHeader());
        assertEquals("k", SophonConfig.getUserInfoEndpoint());
        assertEquals("l", SophonConfig.getIntrospectionEndpointAuthMethodsSupported());
        assertEquals("m", SophonConfig.getDiscovery());

        SophonConfig SophonConfig1 = new SophonConfig();
        SophonConfig1.setClientId("a");
        SophonConfig1.setClientSecret("b");
        SophonConfig1.setAuthorizationEndpoint("c");
        SophonConfig1.setScope("d");
        SophonConfig1.setResponseType("e");
        SophonConfig1.setRedirectUrl("f");
        SophonConfig1.setRealm("g");
        SophonConfig1.setGrantType("h");
        SophonConfig1.setTokenEndpoint("i");
        SophonConfig1.setBearerOnly(false);
        SophonConfig1.setIntrospectionEndpoint("j");
        SophonConfig1.setSetUserInfoHeader(false);
        SophonConfig1.setUserInfoEndpoint("k");
        SophonConfig1.setIntrospectionEndpointAuthMethodsSupported("l");
        SophonConfig1.setDiscovery("m");
        assertEquals("a", SophonConfig.getClientId());
        assertEquals("b", SophonConfig.getClientSecret());
        assertEquals("c", SophonConfig.getAuthorizationEndpoint());
        assertEquals("d", SophonConfig.getScope());
        assertEquals("e", SophonConfig.getResponseType());
        assertEquals("f", SophonConfig.getRedirectUrl());
        assertEquals("g", SophonConfig.getRealm());
        assertEquals("h", SophonConfig.getGrantType());
        assertEquals("i", SophonConfig.getTokenEndpoint());
        assertFalse(SophonConfig.isBearerOnly());
        assertEquals("j", SophonConfig.getIntrospectionEndpoint());
        assertFalse(SophonConfig.isSetUserInfoHeader());
        assertEquals("k", SophonConfig.getUserInfoEndpoint());
        assertEquals("l", SophonConfig.getIntrospectionEndpointAuthMethodsSupported());
        assertEquals("m", SophonConfig.getDiscovery());
        assertEquals(
                "SophonConfig{clientId='a', "
                + "clientSecret='b', "
                + "authorizationEndpoint='c', "
                + "scope='d', "
                + "responseType='e', "
                + "redirectUrl='f', "
                + "realm='g', "
                + "grantType='h', "
                + "tokenEndpoint='i', "
                + "bearerOnly=false, "
                + "introspectionEndpoint='j', "
                + "setUserInfoHeader=false, "
                + "userInfoEndpoint='k', "
                + "introspectionEndpointAuthMethodsSupported='l', "
                + "discovery='m'}",
                SophonConfig1.toString());
    }
}

