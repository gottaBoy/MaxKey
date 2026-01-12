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

package org.apache.shenyu.plugin.Sophon;

import cn.hutool.core.codec.Base64;
import org.apache.shenyu.common.dto.RuleData;
import org.apache.shenyu.common.dto.SelectorData;
import org.apache.shenyu.common.enums.PluginEnum;
import org.apache.shenyu.common.utils.GsonUtils;
import org.apache.shenyu.common.utils.Singleton;
import org.apache.shenyu.plugin.api.ShenyuPluginChain;
import org.apache.shenyu.plugin.api.result.ShenyuResultEnum;
import org.apache.shenyu.plugin.api.result.ShenyuResultWrap;
import org.apache.shenyu.plugin.api.utils.WebFluxResultUtils;
import org.apache.shenyu.plugin.base.AbstractShenyuPlugin;
import org.apache.shenyu.plugin.Sophon.config.SophonConfig;
import org.apache.shenyu.plugin.Sophon.service.SophonService;
import org.apache.shenyu.plugin.Sophon.service.SophonUser;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Objects;

/**
 * The type Sophon plugin.
 */
public class SophonPlugin extends AbstractShenyuPlugin {

    @Override
    protected Mono<Void> doExecute(final ServerWebExchange exchange, final ShenyuPluginChain chain, final SelectorData selector, final RuleData rule) {
        SophonService SophonService = Singleton.INST.get(SophonService.class);
        SophonConfig config = SophonService.getSophonConfig();
        ServerHttpRequest request = exchange.getRequest();

        // ???ﴦ????Ҫtoken???߼?
        if (config.isBearerOnly()) {
            String token = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            boolean isActive = SophonService.introspectAccessToken(token);
            if (isActive) {
                // ???????þ????Ƿ??ȡuserInfo
                return chain.execute(handlerUserInfo(exchange, token, SophonService, config.isSetUserInfoHeader()));
            }
            Object error = ShenyuResultWrap.error(exchange, ShenyuResultEnum.ERROR_TOKEN);
            return WebFluxResultUtils.result(exchange, error);
        }

        // ?ߵ?????˵??没有token 需要处理code??Ȩ??的?߼?
        String code = request.getQueryParams().getFirst("code");
        String state = request.getQueryParams().getFirst("state");
        if (Objects.nonNull(code)) {
            String token = SophonService.getOAuthToken(code);
            // ???????þ????Ƿ??ȡuserInfo
            return chain.execute(handlerUserInfo(exchange, token, SophonService, config.isSetUserInfoHeader()));
        }

        // ?ߵ?????˵??没有code 需要重定向至IdP?????ȡcode
        return SophonService.redirect(exchange, state);
    }

    @Override
    public int getOrder() {
        return PluginEnum.Sophon.getCode();
    }

    @Override
    public String named() {
        return PluginEnum.Sophon.getName();
    }

    @Override
    public boolean skip(final ServerWebExchange exchange) {
        return false;
    }

    // ?ж?ֱ??传递token还是传递userInfo
    private ServerWebExchange handlerUserInfo(final ServerWebExchange exchange, final String token, final SophonService SophonService, final boolean setUserInfo) {
        if (setUserInfo) {
            SophonUser SophonUser = SophonService.getSophonUser(token);
            return handleToken(exchange, SophonUser);
        } else {
            return handleToken(exchange, token);
        }
    }

    // ֱ??使用AccessToken访问收保护的资源
    private ServerWebExchange handleToken(final ServerWebExchange exchange, final String accessToken) {
        ServerHttpRequest.Builder mutate = exchange.getRequest().mutate();
        mutate.headers(httpHeaders -> httpHeaders.remove(HttpHeaders.ACCEPT_ENCODING));
        mutate.header(HttpHeaders.AUTHORIZATION, accessToken);
        return exchange.mutate().request(mutate.build()).build();
    }

    // ??ȡ原始请求对象 根据Sophon??֤解析后的userInfo 重新构建请求??访问收保护的资源
    private ServerWebExchange handleToken(final ServerWebExchange exchange, final SophonUser SophonUser) {
        ServerHttpRequest.Builder mutate = exchange.getRequest().mutate();
        mutate.headers(httpHeaders -> httpHeaders.remove(HttpHeaders.ACCEPT_ENCODING));
        String SophonUserInfoJson = GsonUtils.getInstance().toJson(SophonUser);
        mutate.header("X-Userinfo", Base64.encode(SophonUserInfoJson));
        return exchange.mutate().request(mutate.build()).build();
    }

}

