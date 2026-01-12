package com.jeesite.modules.Sophon.base;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * 
 * @author 长春叭哥
 * @version 2023-02-23
 */
public enum JustAuthPlatformInfo {

    /**
     * ƽ̨
     */
    GITEE("Gitee", "", "", "v1.0.1", false),
    BAIDU("?ٶ?", "", "", "v1.0.1", false),
    CODING("coding", "", "", "v1.0.1", false),
    CSDN("CSDN", "", "", "v1.0.1", false),
    DINGTALK("钉钉扫码??¼", "", "", "v1.0.1", false),
    GITHUB("Github", "", "", "v1.0.1", false),
    OSCHINA("开源中??, "", "", "v1.0.1", false),
    ALIPAY("支付??, "", "", "v1.0.1", false),
    WEIBO("微博", "", "", "v1.0.1", false),

    DOUYIN("????", "", "", "v1.4.0", false),
    ELEME("????ô, "", "", "v1.12.0", false),
    FACEBOOK("Facebook", "", "", "v1.3.0", false),
    GITLAB("Gitlab", "", "", "v1.11.0", false),
    GOOGLE("Google", "", "", "v1.3.0", false),
    HUAWEI("??Ϊ", "", "", "v1.10.0", false),
    JD("京东", "", "", "v1.15.1", false),
    KUJIALE("酷家??, "", "", "v1.11.0", false),
    LINKEDIN("??Ӣ", "", "", "v1.4.0", false),
    MEITUAN("????", "", "", "v1.12.0", false),
    MICROSOFT("微软", "", "", "v1.5.0", false),
    MI("С??", "", "", "v1.5.0", false),
    PINTEREST("Pinterest", "", "", "v1.9.0", false),
    QQ("QQ", "", "", "v1.1.0", false),
    RENREN("????", "", "", "v1.9.0", false),
    STACK_OVERFLOW("Stack Overflow", "", "", "v1.9.0", false),
    TAOBAO("?Ա?", "", "", "v1.2.0", false),
    TEAMBITION("Teambition", "", "", "v1.9.0", false),
    WECHAT_ENTERPRISE("企业微信二维码登??, "", "", "v1.10.0", false),
    WECHAT_MP("微信公众ƽ̨", "", "", "v1.14.0", false),
    WECHAT_OPEN("微信开放平??, "", "", "v1.1.0", false),
    TOUTIAO("????ͷ??", "", "", "v1.6.0-beta", false),
    TWITTER("????", "", "", "v1.13.0", false),
    ALIYUN("阿里??, "", "", "v1.15.5", false),
    MYGITLAB("自定义的Gitlab", "", "", "v1.13.0", false),
    XMLY("喜马拉雅", "", "", "v1.15.9", false),
    WECHAT_ENTERPRISE_WEB("企业微信网页??¼", "", "", "v1.15.9", false),
    FEISHU("飞书", "", "", "1.15.9", false),
    AMAZON("Amazon", "", "", "1.16.0", true),
    DINGTALK_ACCOUNT("钉钉?˺ŵ?¼", "", "", "v1.16.0", true),
    SLACK("slack ??¼", "", "", "v1.16.0", true),
    LINE("line ??¼", "", "", "v1.16.0", true),
    okta("Okta ??¼", "", "", "v1.16.0", true),
    proginn("程序员客??, "", "", "v1.16.2", true),
    ;

    // ƽ̨??
    private final String name;
    // 帮助文档
    private final String readme;
    // 官网api文档
    private final String apiDoc;
    // 集成该平台的 版本
    private final String since;
    private final boolean latest;

    JustAuthPlatformInfo(String name, String readme, String apiDoc, String since, boolean latest) {
        this.name = name;
        this.readme = readme;
        this.apiDoc = apiDoc;
        this.since = since;
        this.latest = latest;
    }

    public static List<Map<String, Object>> getPlatformInfos() {
        List<Map<String, Object>> list = new LinkedList<>();
        Map<String, Object> map = null;
        JustAuthPlatformInfo[] justAuthPlatformInfos = JustAuthPlatformInfo.values();
        for (JustAuthPlatformInfo justAuthPlatformInfo : justAuthPlatformInfos) {
            map = new HashMap<>();
            map.put("name", justAuthPlatformInfo.getName());
            map.put("readme", justAuthPlatformInfo.getReadme());
            map.put("apiDoc", justAuthPlatformInfo.getApiDoc());
            map.put("since", justAuthPlatformInfo.getSince());
            map.put("enname", justAuthPlatformInfo.name().toLowerCase());
            map.put("isLatest", justAuthPlatformInfo.isLatest());
            list.add(map);
        }
        return list;
    }

    public String getName() {
        return name;
    }

    public String getReadme() {
        return readme;
    }

    public String getApiDoc() {
        return apiDoc;
    }

    public String getSince() {
        return since;
    }

    public boolean isLatest() {
        return latest;
    }
}
