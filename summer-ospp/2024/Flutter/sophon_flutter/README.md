# Sophon_flutter

## [Sophon APP 瀹㈡埛绔?Flutter 寮€鍙戦」鐩甝(https://summer-ospp.ac.cn/org/prodetail/24f420154?lang=zh&list=pro)

### 鍔熻兘
- [x] 璐﹀瘑鐧诲綍
- [x] 淇濈暀鐧诲綍鐘舵€?
- [x] 璐﹀彿淇℃伅
- [x] 鎵爜鐧诲綍
- [x] 鐧诲嚭
- [x] TOTP 褰曞叆銆佸睍绀哄拰缂栬緫
- [x] TOTP 涓庤处鍙风粦瀹氱殑鎸佷箙鍖?
- [x] 妫€娴?token 鏄惁鏈夋晥
- [x] 澶氳瑷€
- [x] 鍒囨崲鏃ュ闂存ā寮?
- [x] 鎸囧畾涓绘満鍜屾祴璇曢摼鎺?
- [x] 鏌ョ湅鏃ュ織

### 缂栬瘧甯姪
1. 瀹夎 Flutter 寮€鍙戠幆澧?[Install | Flutter](https://docs.flutter.dev/get-started/install)銆傛湰椤圭洰浣跨敤 Flutter 3.24.1
2. 锛堝彲閫夛級鑷畾涔変富鏈哄湴鍧€銆傚湪 `[lib/persistent.dart](lib/persistent.dart)` 涓慨鏀?`SophonPersistent` 鐨?`_DEFAULT_HOST` 鍊?
3. 缁堢杩愯鍛戒护锛?
   1. 鑾峰彇渚濊禆搴擄細`flutter pub get`
   2. 鐢熸垚澶氳瑷€鏂囦欢锛歚flutter gen-l10n`
   3. 鏋勫缓 Release(Android)锛歚flutter build apk`銆傝瑙?[Build and release an Android app](https://docs.flutter.dev/deployment/android)
   4. 鏋勫缓 Release(iOS)銆傝瑙?[Build and release an iOS app](https://docs.flutter.dev/deployment/ios)

### 浣跨敤鍒扮殑 Package
  dio: 缃戠粶璇锋眰
  go_router: 璺敱绠＄悊
  mobile_scanner: 鎵爜
  shared_preferences: 鎸佷箙鍖?
  auth_totp: TOTP
  logger: 鏃ュ織

### 鐩綍缁撴瀯
- lib
  - l10n // 澶氳瑷€
    - app_en.arb // 鑻辫
    - app_zh.arb // 涓枃
  - Sophon // Sophon API
    - Sophon.dart // Sophon API 鍗曚緥
    - services // Sophon API锛堝弬鐓?[Sophon-web-app/src/app/service](https://gitee.com/dromara/Sophon/tree/main/Sophon-web-frontend/Sophon-web-app/src/app/service)锛?
  - pages // 椤甸潰
  - app_color_scheme.dart // 浠?Sophon 鍥炬爣鐢熸垚鐨勪富棰樿壊
  - main.dart
  - persistent.dart // 鎸佷箙鍖?
  - repeat_tween_animation_builder.dart // 鍔ㄧ敾缁勪欢
  - totp.dart // TOTP 鐩稿叧閫昏緫
  - utils.dart // Logger, route path, str extension
