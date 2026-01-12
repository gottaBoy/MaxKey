# SophonMgtApplication 鍚姩閿欒鎺掓煡鎸囧崡

## 閿欒淇℃伅
```
Caused by: java.lang.IllegalStateException: Failed to introspect Class [org.zeron.sophon.autoconfigure.Oauth20AutoConfiguration] from ClassLoader
```

## 鍙兘鍘熷洜

### 1. 渚濊禆缂哄け鎴栫増鏈啿绐?
- `Oauth20AutoConfiguration` 渚濊禆鐨勬煇浜涚被鍦ㄨ繍琛屾椂涓嶅彲鐢?
- 涓嶅悓妯″潡浣跨敤浜嗕笉鍏煎鐨勪緷璧栫増鏈?

### 2. 缂栬瘧闂
- 绫绘枃浠舵病鏈夋纭紪璇?
- 鏋勫缓缂撳瓨鎹熷潖

### 3. Java 鐗堟湰涓嶅吋瀹?
- 椤圭洰瑕佹眰 Java 17+锛屼絾浣跨敤浜嗗叾浠栫増鏈?

## 瑙ｅ喅鏂规

### 鏂规 1: 娓呯悊骞堕噸鏂版瀯寤猴紙鎺ㄨ崘锛?

```bash
# 鍦ㄩ」鐩牴鐩綍鎵ц
cd Sophon
./gradlew clean build --refresh-dependencies
```

鎴栬€呬娇鐢?Maven锛?
```bash
mvn clean install -U
```

### 鏂规 2: 妫€鏌?Java 鐗堟湰

纭繚浣跨敤 Java 17 鎴栨洿楂樼増鏈細
```bash
java -version
# 搴旇鏄剧ず java version "17" 鎴栨洿楂?
```

### 鏂规 3: 妫€鏌ヤ緷璧栧畬鏁存€?

妫€鏌?`Sophon-protocol-oauth-2.0` 妯″潡鏄惁姝ｇ‘缂栬瘧锛?
```bash
cd Sophon-protocols/Sophon-protocol-oauth-2.0
./gradlew build
```

### 鏂规 4: 涓存椂鎺掗櫎鑷姩閰嶇疆锛堝鏋滀笉闇€瑕?OAuth2.0 鍔熻兘锛?

濡傛灉绠＄悊绔笉闇€瑕?OAuth2.0 鍔熻兘锛屽彲浠ュ湪 `SophonMgtApplication.java` 涓帓闄わ細

```java
@SpringBootApplication(
    exclude = {
        org.zeron.sophon.autoconfigure.Oauth20AutoConfiguration.class
    }
)
```

### 鏂规 5: 妫€鏌ョ被璺緞

纭繚浠ヤ笅渚濊禆鍦ㄧ被璺緞涓細
- `jakarta.servlet-api` (Spring Boot 3.x 浣跨敤 Jakarta EE)
- `spring-boot-starter-web`
- `Sophon-protocol-oauth-2.0` 妯″潡

### 鏂规 6: 鏌ョ湅瀹屾暣閿欒鍫嗘爤

杩愯搴旂敤鏃舵坊鍔?`--debug` 鍙傛暟鏌ョ湅璇︾粏閿欒淇℃伅锛?
```bash
java -jar Sophon-mgt-boot-*.jar --debug
```

## 甯歌闂

### Q: 涓轰粈涔堜細鍑虹幇杩欎釜閿欒锛?
A: Spring Boot 鍦ㄥ惎鍔ㄦ椂浼氬皾璇曞姞杞芥墍鏈夎嚜鍔ㄩ厤缃被銆傚鏋滄煇涓嚜鍔ㄩ厤缃被渚濊禆鐨勭被涓嶅瓨鍦ㄦ垨鏃犳硶鍔犺浇锛屽氨浼氬嚭鐜拌繖涓敊璇€?

### Q: 濡備綍纭畾鏄摢涓緷璧栫己澶憋紵
A: 鏌ョ湅瀹屾暣鐨勯敊璇爢鏍堬紝閫氬父浼氭樉绀?`NoClassDefFoundError` 鎴?`ClassNotFoundException`锛屾寚鍑虹己澶辩殑绫汇€?

### Q: 绠＄悊绔槸鍚﹂渶瑕?OAuth2.0 鍔熻兘锛?
A: 濡傛灉绠＄悊绔彧鐢ㄤ簬绠＄悊搴旂敤閰嶇疆锛屼笉闇€瑕佸鐞?OAuth2.0 鎺堟潈娴佺▼锛屽彲浠ユ帓闄よ鑷姩閰嶇疆銆?


