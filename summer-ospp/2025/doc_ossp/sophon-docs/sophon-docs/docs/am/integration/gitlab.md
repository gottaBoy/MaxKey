---
title: GitLab闆嗘垚鎸囧崡
sidebar_position: 7
---

## GitLab 浠嬬粛

GitLab 鏄敱 GitLab Inc.寮€鍙戯紝浣库饯 MIT 璁稿彲璇佺殑鍩轰簬饨圭粶鐨?Git 浠撳簱绠＄悊饧叿锛屼笖鍏锋湁 wiki 鍜?issue
璺熻釜鍔熻兘銆備娇饨?Git 浣滀负浠ｇ爜绠＄悊饧叿锛屽苟鍦ㄦ鍩虹涓婃惌寤鸿捣鏉ョ殑 web 鏈嶅姟銆?

瀹樷絽饨圭珯鍦板潃锛歨ttps://about.gitlab.com/

## GitLab 瀹夎閰嶇疆

### GitLab 瀹夎

璇峰弬鐓у畼饨呪絺妗?https://about.gitlab.com/install/

### 閰嶇疆

鍏蜂綋鍙弬鐓?https://docs.gitlab.com/ee/integration/oauth_provider.html

缂栬緫 gitlab.rb

```sh
vim /etc/gitlab/gitlab.rb
```

澧炲姞 Oauth 閰嶇疆锛?

```ini
gitlab_rails['omniauth_enabled'] = true
gitlab_rails['omniauth_allow_single_sign_on'] = ['oauth2_generic'] #璺熶笅饩殑 name 瀵瑰簲锛屼笉寤鸿淇敼
gitlab_rails['omniauth_block_auto_created_users'] = false # 鏄惁饩冨姩鍒涘缓璐﹀彿
gitlab_rails['omniauth_providers'] = [
    {
        'name' => 'oauth2_generic', #姝ゅ璺焟axke閰嶇疆鐨勫洖璋冨湴鍧€鏈夊叧绯?
        'label': 'SSO', # 姝ゅ鏄剧ず鍦?SSO 鎺堟潈鐧诲綍鐨勫悕绉?
         // highlight-start
        'app_id' => '9cdbccbe-47a0-4adb-9d3d-7e0eceacaace',
        'app_secret' => 'F3QOMTUwMzIwMjExMTMyMTAzNDknMW',
        // highlight-end
        'args' => {
            client_options: {
                 // highlight-start
                'site' => 'http://yourdomain', # Sophon 璁よ瘉绔殑鍩熷悕
                'authorize_url'=>'/sign/authz/oauth/v20/authorize',
                'token_url'=>'/sign/authz/oauth/v20/token',
                'user_info_url' => '/sign/api/oauth/v20/me'
                // highlight-end
            },
            user_response_structure: {
                root_path: [],
                 // highlight-start
                id_path: ['username'],
                // highlight-end
                attributes: { name: 'realname', email: 'username'}
            },
            #name: 'Sophon',
            strategy_class: "OmniAuth::Strategies::OAuth2Generic"
        }
    }
]
```
閰嶇疆饨備欢淇敼瀹屾垚鍚庯紝 閲嶈閰嶇疆锛?
```
gitlab-ctl reconfigure
```

閲嶈瀹屾瘯锛?绛夊緟绾?30 绉掋€?

閲嶆柊鍚姩 gitliab
```
gitlab-ctl restart
```

### 鍒涘缓璐﹀彿
....鐣?

### 鍒涘缓饧€涓处鍙?Sophon
....鐣?

### 鍏宠仈 Gitlab 璐﹀彿

饨ゆ埛鐧诲綍 gitlab 涔嬪悗锛?鍦?setting-Account 涓偣鍑?Connect 杩涒緩璐︽埛鍏宠仈銆?
<img src="/doc/images/integration/gitlab/1.png"  />

<img src="/doc/images/integration/gitlab/2.png"  />

鍏宠仈鎴愬姛鍚庯紝 鍗冲彲浣库饯鐧诲綍饣氱殑 Oauth2 鐧诲綍銆?

### 娉ㄦ剰浜嬮」
Gitlab 蹇呴』瑕佲伎鍔ㄥ叧鑱斿悗锛?鎵嶅彲鍗曠偣鐧诲綍銆?
https 闇€瑕侀厤缃?omiauth 鐨?provider_ignores_state:true锛?鍚屾椂闇€瑕佹妸 Sophon 鐨勮瘉涔︽斁鍒?gitlab 鐨?
trusted-certs 涓嬶紝 鐒跺悗 閲嶆柊閰嶇疆 gitlab-ctl reconfigure 灏卞ソ浜嗐€?

## Sophon 閰嶇疆鍙婄櫥褰曢獙璇?

### 搴斺饯閰嶇疆

杩涒紛鍚庡彴"搴斺饯绠＄悊" 锛岀紪杈戝簲饨?
<img src="/doc/images/integration/gitlab/3.png"  />

杩涘叆"OAuth2.0 閰嶇疆",閰嶇疆濡備笅
<img src="/doc/images/integration/gitlab/4.png"  />

### 搴斺饯璁块棶璧嬫潈

濡傛灉涓嶅湪璇ュ垪琛ㄥ唴锛屽彲浠モ€滄柊澧炴垚鍛樷€?

### 鍗曠偣鐧诲綍楠岃瘉

閲嶆柊鐧诲綍 Sophon锛岀偣鍑?Gitlab"鍥炬爣鍗曠偣鐧诲綍

