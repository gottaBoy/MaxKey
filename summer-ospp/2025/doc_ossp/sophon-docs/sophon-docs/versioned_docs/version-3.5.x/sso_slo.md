---
title: 鍗曠偣娉ㄩ攢
sidebar_position: 9
---
## 鍗曠偣娉ㄩ攢
	
鍗曠偣娉ㄩ攢(Single Logout)鏄寚鐢ㄦ埛鍦ㄤ竴涓郴缁熼€€鍑哄悗锛屽叾鎵€鑳藉崟鐐圭櫥褰曡闂殑鎵€鏈夌郴缁熼兘鍚屾椂閫€鍑恒€傚崟鐐规敞閿€涓昏鏄负鎻愰珮瀹夊叏鎬э紝閬垮厤鐢ㄦ埛蹇樿閫€鍑烘墍鏈夊簲鐢ㄨ€岄€犳垚淇℃伅鐨勬硠瀵嗐€?
    	
    	
IDP鏀寔鍗曠偣娉ㄩ攢(SLO),鍗崇敤鎴蜂笉浠呬粎浠庤璇佷腑蹇冩敞閿€锛屽悓鏃朵篃娉ㄩ攢浠庤璇佷腑蹇冭闂殑搴旂敤绯荤粺銆?
		
		
鍏跺疄鐜版柟寮忎篃闈炲父绠€鍗曪紝鐢变簬SSO鍜屽崟鐐圭櫥褰曠殑搴旂敤閮芥槸鍒嗗紑鐨勶紝浣跨敤涓嶅悓鐨勫煙鍚嶏紝鍙槸閫氳繃璁よ瘉涓績鍦ㄥ涓簲鐢ㄧ郴缁熶腑浼犻€掕韩浠藉拰鐧诲綍绯荤粺銆傚洜姝わ紝棣栧厛娉ㄩ攢鍗曠偣鐧诲綍搴旂敤锛岀劧鍚庝慨鏀规瘡涓簲鐢ㄧ郴缁熼兘浣跨敤SSO鐨勫崟鐐规敞閿€椤甸潰锛孲SO鐨勯€€鍑洪〉闈細灏嗙敤鎴风櫥褰曠殑Session娉ㄩ攢鎺夈€?
		
## 鍗曠偣娉ㄩ攢杩囩▼
		
1,搴旂敤绯荤粺鍏堝畬鎴愭湰绯荤粺娉ㄩ攢锛屾敞閿€瀹屾垚鍚庤皟鐢ㄨ璇佷腑蹇冪殑鍗曠偣娉ㄩ攢鍦板潃銆?
		
		
2,淇敼搴旂敤鍗曠偣娉ㄩ攢瀹屾垚鍚庣殑鍦板潃涓篽ttps://sso.Sophon.top/Sophon/force/logout,鍙傛暟reLoginUrl涓烘敞閿€瀹屾垚鍚庤闂湴鍧€銆?
		


## 鍗曠偣娉ㄩ攢鏈哄埗
Sophon鍦ㄧ櫥褰曞畬鎴愬悗锛屼細鐢熸垚鍦ㄧ嚎浠ょ墝锛岃浠ょ墝瀛樺偍鍦–ookie鍜屾湇鍔″櫒涓紝褰撳崟鐐圭櫥褰曟槸浼氬悜搴旂敤浼犻€掑湪绾夸护鐗岋紝搴旂敤閫氳繃鍒ゆ柇浠ょ墝鐨勭姸鎬佹鏌ュ綋鍓嶇敤鎴锋槸鍚﹀湪绾匡紝濡傛灉浠ょ墝澶辨晥锛屽垯搴旂敤鑷姩娉ㄩ攢锛岃揪鍒板崟鐐规敞閿€鐨勫姛鑳姐€?


### IDP涓诲姩娉ㄩ攢
Sophon娉ㄩ攢鏃跺悜SP鍙戦€佹敞閿€璇锋眰锛岃姹傚寘鍚敞閿€鐨勪护鐗岋紝SP鑾峰彇娉ㄩ攢鐨勪护鐗岋紝閫氱煡瀹㈡埛绔繘琛屾敞閿€

鍩轰簬CAS鐨勫崟鐐圭櫥褰曪紝鍦ㄥ崟鐐圭櫥褰曟椂SP璁颁綇Sophon鐨則icket锛屽綋Sophon鍗曠偣娉ㄩ攢鏃跺悜SP鍙戦€佸弬鏁颁负logoutRequest锛岃姹傚唴瀹瑰叆涓?

```xml
<samlp:LogoutRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="%s" Version="2.0" IssueInstant="%s">
	<saml:NameID xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">%s</saml:NameID>
	<samlp:SessionIndex>%s</samlp:SessionIndex>
</samlp:LogoutRequest>
```

鍩轰簬Sophon鍦ㄧ嚎token娉ㄩ攢鏈哄埗锛屽湪鍗曠偣鐧诲綍鏃禡axKey浼氭妸鍦ㄧ嚎token鍙戦€佺粰SP锛孲P闇€瑕佸瓨鍌ㄨ浠ょ墝锛屽綋Sophon鍗曠偣娉ㄩ攢鏃跺悜SP鍙戦€佽姹?
<table border="0" class="table table-striped table-bordered ">
	<thead>
		<tr>
			<th>搴忓彿</th><th>鍙傛暟</th><th>澶囨敞</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>1</td><td>request</td><td>logoutRequest</td>
		</tr>
		<tr>
			<td>2</td><td>id</td><td>闅忔満id</td>
		</tr>
		<tr>
			<td>3</td><td>principal</td><td>鐧诲綍鐢ㄦ埛鍚?/td>
		</tr>
		<tr>
			<td>4</td><td>issueInstant</td><td>鐧诲嚭鏃堕棿</td>
		</tr>
		<tr>
			<td>5</td><td>ticket</td><td>褰撳墠鍦ㄧ嚎ticket</td>
		</tr>
	</tbody>
</table>


### SP鎺ュ彛娉ㄩ攢
SP鍚慚axKey鐨勬帴鍙ｅ畾鏃跺彂閫佽姹傦紝妫€鏌ヤ护鐗岀殑鏈夋晥鎬э紝濡傛灉浠ょ墝澶辨晥锛屽垯搴旂敤閫€鍑虹櫥褰曪紝楠岃瘉鍦ㄧ嚎token鍦板潃sign/onlineticket/validate,鍙傛暟涓簍icket涓轰护鐗宨d

### Cookie鏈夋晥鎬ф敞閿€
鐧诲綍瀹屾垚鍚庡湪绾夸护鐗屽瓨鍌ㄥ湪.Sophon.top鐨勫煙鍚嶄笅锛孋ookie鍚嶇О涓簅nline_ticket锛孲P搴旂敤鍜孧axKey浣跨敤**瀛愬煙鍚?Sophon.top**锛屽簲鐢ㄦ牴鎹护鐗屾湁鏁堟€у垽鏂槸鍚︽敞閿€銆?


### 鍏抽棴娴忚鍣ㄦ敞閿€
Sophon娉ㄩ攢锛岀劧鍚庡湪娉ㄩ攢鐨勭晫闈娇鐢╦avascript鍏抽棴娴忚鍣ㄣ€?


## 瀹炵幇鏈哄埗姣旇緝
<table border="0" class="table table-striped table-bordered ">
<thead>
	<th >搴忓彿</th><th>鏈哄埗</th><th>閫傚簲鍦烘櫙</th>
</thead>
<tbody>
	<tr>
		<td>1</td>
		<td>IDP涓诲姩娉ㄩ攢</td>
		<td>SP瀹炵幇鎺ュ彛鐢ㄤ簬Sophon璋冪敤</td>
	</tr>
	<tr>
		<td>2</td>
		<td>SP鎺ュ彛娉ㄩ攢</td>
		<td>瀵筂axKey璇锋眰棰戠箒鏈変竴瀹氬帇鍔?/td>
	</tr>
	<tr>
		<td>3</td>
		<td>Cookie鏈夋晥鎬ф敞閿€</td>
		<td>鍚屽煙锛屽疄鐜扮畝鍗?/td>
	</tr>
	<tr>
		<td>4</td>
		<td>娉ㄩ攢Sophon骞跺叧闂祻瑙堝櫒</td>
		<td>鍏抽棴鏁翠釜娴忚鍣?/td>
	</tr>
</tbody>
</table>
    
