package com.jeesite.modules.Sophon.base;

import com.jeesite.modules.Sophon.oauth.realm.request.AuthSophonJeeGitRequest;

import me.zhyd.oauth.config.AuthSource;
import me.zhyd.oauth.request.AuthDefaultRequest;

/**
 * Oauth2 默认?ӿ?说明
 * 
 * @author 长春叭哥 2023??2??3??
 *
 */
public enum AuthCustomSource implements AuthSource {

    /**
     * 自己搭建的gitlab私服
     */
    Sophon {
    /**
     * 授权的api
     *
     * @return url
     */
    @Override
    public String authorize() {
        return AuthSophonJeeGitRequest.BASE_HOST + "/sign/authz/oauth/v20/authorize";
    }

    /**
     * ??ȡaccessToken的api
     *
     * @return url
     */
    @Override
    public String accessToken() {
        return AuthSophonJeeGitRequest.BASE_HOST + "/sign/authz/oauth/v20/token";
    }

    /**
     * ??ȡ?û?信息的api
     *
     * @return url
     */
    @Override
    public String userInfo() {
        return AuthSophonJeeGitRequest.BASE_HOST + "/sign/api/oauth/v20/me";
    }

    /**
     * 平台对应??AuthRequest 实现类，必须继承??{@link AuthDefaultRequest}
     *
     * @return class
     */
    @Override
    public Class<? extends AuthDefaultRequest> getTargetClass() {
        return AuthSophonJeeGitRequest.class;
    }
    }
}
