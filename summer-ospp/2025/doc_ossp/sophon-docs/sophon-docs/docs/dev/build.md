---
layout: zh/default
sidebar_position: 5
---
# 椤圭洰鏋勫缓

## Java椤圭洰鏋勫缓
### 閰嶇疆鐜鍙橀噺
```powershell
setEnvVars.bat

set JAVA_HOME=D:\IDE\jdk-17.0.9+9

set GRADLE_HOME=C:\IDE\gradle-8.8
```


### 鏍囧噯鏋勫缓

1.鍚姩鏋勫缓

```powershell
gradlew build -x test鎴栬€卹elease.bat
```

2.鏋勫缓缁撴灉

鏋勫缓鍖呰矾寰?

Sophon/build

渚濊禆鍖呰矾寰?

Sophon-webs/Sophon-web-manage/

Sophon-webs/Sophon-web-Sophon/


### Docker鏋勫缓

1.Docker 鏋勫缓閰嶇疆

```powershell
release_cnf_docker.bat
```

2.鍚姩鏋勫缓

```powershell
gradlew build jib -x test鎴栬€卹elease_docker.bat
```

3.鏋勫缓鐨勭粨鏋?

Sophon-web-manage/

Sophon-web-Sophon/


### 浼犵粺鏋勫缓

1.浼犵粺 鏋勫缓閰嶇疆

```powershell
release_cnf_tradition.bat
```

2.鍚姩鏋勫缓

gradlew build -x test鎴栬€卹elease.bat


3.鏋勫缓鐨勭粨鏋?

鏋勫缓鍖呰矾寰?

Sophon/build/Sophon-jars

渚濊禆鍖呰矾寰?

Sophon/build/Sophon-v(version)GA


## 鍓嶇鏋勫缓Build

1)Sophon缁熶竴璁よ瘉鍓嶇

Sophon-web-frontend/Sophon-web-app

```powershell
ng build --prod --base-href /Sophon/
```

2)Sophon韬唤瀹夊叏绠＄悊鍓嶇

Sophon-web-frontend/Sophon-web-mgt-app

```powershell
ng build --prod --base-href /Sophon-mgt/
```

## 闂鍙婅В鍐?

闂1
```powershell
 yarn start
 ```

```
CategoryInfo          : SecurityError: 锛孭SSecurityException
FullyQualifiedErrorId : UnauthorizedAccess
```

瑙ｅ喅鏂规锛?
```powershell
Set-ExecutionPolicy RemoteSigned -Scope Process
```

