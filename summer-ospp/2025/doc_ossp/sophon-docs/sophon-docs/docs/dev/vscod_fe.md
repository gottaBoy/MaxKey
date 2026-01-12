---
layout: zh/default
sidebar_position: 4
---
# VS Code鍓嶇寮€鍙戞寚鍗?
Visual Studio Code锛堢畝绉扳€淰S Code鈥?锛夋槸Microsoft寮€鍙戜竴涓繍琛屼簬 Mac OS X銆乄indows鍜?Linux 涔嬩笂鐨勶紝閽堝浜庣紪鍐欑幇浠eb鍜屼簯搴旂敤鐨勮法骞冲彴婧愪唬鐮佺紪杈戝櫒锛?鍙湪妗岄潰涓婅繍琛岋紝骞朵笖鍙敤浜嶹indows锛宮acOS鍜孡inux銆傚畠鍏锋湁瀵笿avaScript锛孴ypeScript鍜孨ode.js鐨勫唴缃敮鎸侊紝骞跺叿鏈変赴瀵岀殑鍏朵粬璇█锛堜緥濡侰++锛孋锛冿紝Java锛孭ython锛孭HP锛孏o锛夊拰杩愯鏃讹紙渚嬪.NET鍜孶nity锛夋墿灞曠殑鐢熸€佺郴缁熴€?

## 寮€鍙戠幆澧冨惎鍔?
- 鍚姩vs code骞堕€夋嫨鎵撳紑鐩綍

![start](/images/dev/vscode/start.png)

- 閫夋嫨鎵撳紑椤圭洰鐩綍
![folder](/images/dev/vscode/folder.png)

- 瀵煎叆瀹屾垚
![import_s.png](/images/dev/vscode/import_s.png)

## 渚濊禆鍖呭畨瑁?

```powershell
npm install -g @angular/cli@13.3.0

npm install

npm i --save-dev @angular-devkit/build-angular@13.3.0

yarn install
```
## 缁熶竴璁よ瘉鍓嶇

Sophon-web-frontend/Sophon-web-app
```powershell
yarn start
```

## 韬唤瀹夊叏绠＄悊鍓嶇

Sophon-web-frontend/Sophon-web-mgt-app
```powershell
yarn start
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

