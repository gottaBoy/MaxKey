---
layout: zh/default
sidebar_position: 2
---
# Eclipse寮€鍙戞寚鍗?

Eclipse 鏄竴涓紑鏀炬簮浠ｇ爜鐨勩€佸熀浜嶫ava鐨勫彲鎵╁睍寮€鍙戝钩鍙般€傚氨鍏舵湰韬€岃█锛屽畠鍙槸涓€涓鏋跺拰涓€缁勬湇鍔★紝鐢ㄤ簬閫氳繃鎻掍欢缁勪欢鏋勫缓寮€鍙戠幆澧冦€傚垢杩愮殑鏄紝Eclipse 闄勫甫浜嗕竴涓爣鍑嗙殑鎻掍欢闆嗭紝鍖呮嫭Java寮€鍙戝伐鍏凤紙Java Development Kit锛孞DK锛夈€?


## 寮€鍙戝伐鍏峰強鐩稿叧杞欢

<table border="0" class="table table-striped table-bordered ">
	<thead>
		<th  >杞欢</th><th>鐗堟湰</th><th>鎺ㄨ崘</th><th>鐩綍</th><th>澶囨敞</th>
	</thead>
	<tbody>
		<tr>
			<td>JDK</td>
			<td>17 +</td>
			<td></td>
			<td>C:\ide\jdk-17.0.9+9</td>
			<td>JAVA杩愯鍙婂紑鍙戝伐鍏峰寘</td>
		</tr>
		<tr>
			<td>eclipse-jee</td>
			<td>2024-09</td>
			<td>鎺ㄨ崘</td>
			<td>C:\ide\eclipse-jee-2024-09-R</td>
			<td>JAVA寮€鍙戝伐鍏?/td>
		</tr>
		<tr>
			<td>Gradle</td>
			<td>8.8+ </td>
			<td></td>
			<td>C:\ide\gradle-8.8</td>
			<td>浠ｇ爜鏋勫缓</td>
		</tr>
	</tbody>
</table>	

## 浠撳簱浠ｇ爜涓嬭浇
- 浠ｇ爜鍦板潃锛?a href="https://Sophon.top/zh/about/download.html">璁块棶</a>

- 鍒涘缓eclipse宸ヤ綔鍖猴紝workspace-Sophon-demo

- 浠ｇ爜鍏嬮殕鍒板伐浣滃尯鍐?

```
workspace-Sophon-demo                            #宸ヤ綔鍖?
鈹溾攢鈹€ Sophon                                       #椤圭洰鐩綍
```


## 寮€鍙戠幆澧冨惎鍔?
- 鍚姩eclipse

![start](/images/dev/eclipse/start.png)

- 閫夋嫨宸ヤ綔鍖簑orkspace-Sophon-demo

![start_workspace](/images/dev/eclipse/start_workspace.png)

- 閫夋嫨瀵煎叆Gradle椤圭洰

![import](/images/dev/eclipse/import.png)

- 閫夋嫨瀵煎叆椤圭洰鐩綍

![import2](/images/dev/eclipse/import2.png)

- 鏈湴Gradle閰嶇疆

![import3](/images/dev/eclipse/import3.png)

- 纭瀵煎叆椤圭洰淇℃伅

![import4](/images/dev/eclipse/import4.png)

- 椤圭洰瀵煎叆绛夊緟

![import5](/images/dev/eclipse/import5.png)

- 椤圭洰瀵煎叆瀹屾垚

![imports](/images/dev/eclipse/import_s.png)

## 鍚庣椤圭洰

1)Sophon缁熶竴璁よ瘉绯荤粺

Sophon-webs/Sophon-web-Sophon/src/main/java/org/Sophon/SophonApplication.java 

![sso](/images/dev/eclipse/sso.png)

2)Sophon韬唤瀹夊叏绠＄悊绯荤粺

Sophon-webs/Sophon-web-mgt/src/main/java/org/Sophon/SophonMgtApplication.java

![mgt](/images/dev/eclipse/mgt.png)

## 椤圭洰杩愯

![run](/images/dev/eclipse/run.png)

## 闂鍙婅В鍐?

```
鈥淎 cycle was detected in the build path of project: XXX鈥?
```

瑙ｅ喅鏂规硶锛?
 
Eclipse Menu -> Window -> Preferences... -> Java -> Compiler -> Building -> Building path problems -> Circular dependencies -> 灏咵rror鏀规垚Warning

