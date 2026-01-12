---
title: 鍥剧墖楠岃瘉鐮?
sidebar_position: 2
---
# 楠岃瘉鐮?

<b>楠岃瘉鐮侊紙CAPTCHA锛?/b>鏄€淐ompletely Automated Public Turing test to tell Computers and Humans Apart鈥濓紙鍏ㄨ嚜鍔ㄥ尯鍒嗚绠楁満鍜屼汉绫荤殑鍥剧伒娴嬭瘯锛夌殑缂╁啓锛屾槸涓€绉嶅尯鍒嗙敤鎴锋槸璁＄畻鏈鸿繕鏄汉鐨勫叕鍏卞叏鑷姩绋嬪簭銆傚彲浠ラ槻姝㈢敤鎴风敤鐗瑰畾绋嬪簭鏆村姏鐮磋В鏂瑰紡杩涜涓嶆柇鐨勭櫥闄嗗皾璇曘€?


## 鏂囨湰楠岃瘉鐮?

![鏂囨湰楠岃瘉鐮乚(/images/authn/captcha_text.png)


## 绠楁湳楠岃瘉鐮?

![captcha_arithmetic](/images/authn/captcha_arithmetic.png)

## 楠岃瘉鐮侀厤缃?

鏂囦欢
Sophon/application-https(http).properties

褰撻厤缃畻鏈獙璇佺爜鏃跺嵆 Sophon.login.captcha.type=arithmetic

kaptcha鐨勯厤缃腑蹇呴』涓烘暟瀛?

kaptcha.textproducer.char.string=0123456789

```ini
#鏄惁鏀寔楠岃瘉鐮?
Sophon.login.captcha=true
#text 鏂囨湰锛?arithmetic 绠楁湳楠岃瘉鐮?
Sophon.login.captcha.type=text
```

<h3>楠岃瘉鐮侀厤缃枃浠?/h3>
Sophon浣跨敤kaptcha浣滀负楠岃瘉鐮佺殑鎻掍欢锛岃缁嗗彲鍙傝€僈aptchar璇︾粏閰嶇疆琛?

鏂囦欢
Sophon/kaptcha.properties

榛樿閰嶇疆濡備笅

```ini
#瀹藉害
kaptcha.image.width=80
#闀垮害
kaptcha.image.height=25
kaptcha.border=no
kaptcha.obscurificator.impl=com.google.code.kaptcha.impl.ShadowGimpy
kaptcha.textproducer.font.size=23
#鐢熸垚瀛楃锛岄粯璁ゅ€间负鏁板瓧
kaptcha.textproducer.char.string=0123456789
#浣嶆暟
kaptcha.textproducer.char.length=4
kaptcha.noise.impl=com.google.code.kaptcha.impl.NoNoise
```




```ini
kaptcha.textproducer.char.string=0123456789
```


## Kaptchar璇︾粏閰嶇疆琛?

<table border="0" class="table table-striped table-bordered ">
	<tbody>
		<tr>
			<td><strong>Constant</strong></td>
			<td><strong>鎻忚堪</strong></td>
			<td><strong>榛樿鍊?/strong></td>
		</tr>
		<tr>
			<td>kaptcha.border</td>
			<td>鍥剧墖杈规锛屽悎娉曞€硷細yes , no</td>
			<td>yes</td>
		</tr>
		<tr>
			<td>kaptcha.border.color</td>
			<td>杈规棰滆壊锛屽悎娉曞€硷細 r,g,b (and optional alpha) 鎴栬€?white,black,blue.</td>
			<td>black</td>
		</tr>
		<tr>
			<td>kaptcha.border.thickness</td>
			<td>杈规鍘氬害锛屽悎娉曞€硷細&gt;0</td>
			<td>1</td>
		</tr>
		<tr>
			<td>kaptcha.image.width</td>
			<td>鍥剧墖瀹?/td>
			<td>200</td>
		</tr>
		<tr>
			<td>kaptcha.image.height</td>
			<td>鍥剧墖楂?/td>
			<td>50</td>
		</tr>
		<tr>
			<td>kaptcha.producer.impl</td>
			<td>鍥剧墖瀹炵幇绫?/td>
			<td>com.google.code.kaptcha.impl.DefaultKaptcha</td>
		</tr>
		<tr>
			<td>kaptcha.textproducer.impl</td>
			<td>鏂囨湰瀹炵幇绫?/td>
			<td>com.google.code.kaptcha.text.impl.DefaultTextCreator</td>
		</tr>
		<tr>
			<td>kaptcha.textproducer.char.string</td>
			<td>鏂囨湰闆嗗悎锛岄獙璇佺爜鍊间粠姝ら泦鍚堜腑鑾峰彇</td>
			<td>abcde2345678gfynmnpwx</td>
		</tr>
		<tr>
			<td>kaptcha.textproducer.char.length</td>
			<td>楠岃瘉鐮侀暱搴?/td>
			<td>5</td>
		</tr>
		<tr>
			<td>kaptcha.textproducer.font.names</td>
			<td>瀛椾綋</td>
			<td>Arial, Courier</td>
		</tr>
		<tr>
			<td>kaptcha.textproducer.font.size</td>
			<td>瀛椾綋澶у皬</td>
			<td>40px.</td>
		</tr>
		<tr>
			<td>kaptcha.textproducer.font.color</td>
			<td>瀛椾綋棰滆壊锛屽悎娉曞€硷細 r,g,b &nbsp;鎴栬€?white,black,blue.</td>
			<td>black</td>
		</tr>
		<tr>
			<td>kaptcha.textproducer.char.space</td>
			<td>鏂囧瓧闂撮殧</td>
			<td>2</td>
		</tr>
		<tr>
			<td>kaptcha.noise.impl</td>
			<td>骞叉壈瀹炵幇绫?/td>
			<td>com.google.code.kaptcha.impl.DefaultNoise</td>
		</tr>
		<tr>
			<td>kaptcha.noise.color</td>
			<td>骞叉壈&nbsp;棰滆壊锛屽悎娉曞€硷細 r,g,b 鎴栬€?white,black,blue.</td>
			<td>black</td>
		</tr>
		<tr>
			<td>kaptcha.obscurificator.impl</td>
			<td>鍥剧墖鏍峰紡锛?nbsp;<br/>姘寸汗com.google.code.kaptcha.impl.WaterRipple&nbsp; <br/>楸肩溂com.google.code.kaptcha.impl.FishEyeGimpy <br/>闃村奖com.google.code.kaptcha.impl.ShadowGimpy</td>
			<td>com.google.code.kaptcha.impl.WaterRipple</td>
		</tr>
		<tr>
			<td>kaptcha.background.impl</td>
			<td>鑳屾櫙瀹炵幇绫?/td>
			<td>com.google.code.kaptcha.impl.DefaultBackground</td>
		</tr>
		<tr>
			<td>kaptcha.background.clear.from</td>
			<td>鑳屾櫙棰滆壊娓愬彉锛屽紑濮嬮鑹?/td>
			<td>light grey</td>
		</tr>
		<tr>
			<td>kaptcha.background.clear.to</td>
			<td>鑳屾櫙棰滆壊娓愬彉锛?nbsp;缁撴潫棰滆壊</td>
			<td>white</td>
		</tr>
		<tr>
			<td>kaptcha.word.impl</td>
			<td>鏂囧瓧娓叉煋鍣?/td>
			<td>com.google.code.kaptcha.text.impl.DefaultWordRenderer</td>
		</tr>
		<tr>
			<td>kaptcha.session.key</td>
			<td>session key</td>
			<td>KAPTCHA_SESSION_KEY</td>
		</tr>
		<tr>
			<td>kaptcha.session.date</td>
			<td>session date</td>
			<td>KAPTCHA_SESSION_DATE</td>
		</tr>
	</tbody>
</table>
