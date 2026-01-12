---
sidebar_position: 1
---
# OpenID Connect鍗忚闆嗘垚
鏈枃浠嬬粛OpenID Connect鍗忚濡備綍涓嶮axKey杩涜闆嗘垚銆?

## 璁よ瘉娴佺▼

璇峰弬鐓Auth2璁よ瘉娴佺▼

## 搴旂敤娉ㄥ唽
搴旂敤鍦∕axKey绠＄悊绯荤粺杩涜娉ㄥ唽锛屾敞鍐岀殑閰嶇疆淇℃伅濡備笅

![sso_oidc_conf](/images/sso/sso_oidc_conf.png)


## 闆嗘垚鍜屾帴鍙?
鐢ㄦ埛灞炴€ф帴鍙?api/connect/v10/userinfo

閫氳繃璁块棶token 鑾峰彇鐧诲綍鐢ㄦ埛淇℃伅鍙婄鍚嶄俊鎭紝鍦ㄧ▼搴忎腑蹇呴』楠岃瘉鐩稿叧鐨勭鍚嶄俊鎭€?
 
<table  border="0" class="table table-striped table-bordered ">
 	   <tr>
	    <th> 鎺ュ彛鍚嶇О </th>
	    <th> OIDC鎺堟潈鐢ㄦ埛淇℃伅鏌ヨ鎺ュ彛 </th>
  	  </tr>
	  <tr>
	    <td> url </td>
	    <td>https://sso.Sophon.org/sign/api/connect/v10/userinfo</td>
	  </tr>
	  <tr>
	    <td> 璇锋眰鏂瑰紡 </td>
	    <td> http get/post </td>
	  </tr>
</table>
 	 
<h5>璇锋眰鍙傛暟</h5>

<table  border="0" class="table table-striped table-bordered ">
 	   <tr>
	    <th>鍙傛暟 </th>
	    <th> 璇存槑 </th>
  	  </tr>
	  <tr>
	    <td> access_token </td>
	    <td> 璋冪敤sso/ token鑾峰緱鐨則oken鍊笺€?</td>
	  </tr>
	  <tr align="left">
	  	<td colspan="2" align="left">
	  				瀹為檯璇锋眰濡備笅锛?

```http
POST /oauth/userinfo HTTP/1.1
Host: sso.Sophon.org/openapi
Content-Type: application/x-www-form-urlencoded
access_token= PQ7q7W91a-oMsCeLvIaQm6bTrgtp7
```
</td>
	  </tr>
	  <tr>
	  		<td colspan="2" align="left">
	  		杩斿洖鏁版嵁/ response data
	  		</td>
	  </tr>
	  <tr>
	  		<td colspan="2">
	  		<p>鎴愬姛杩斿洖JSON鏁版嵁锛屽涓嬶細</p>

```json
{
	userid     :  "zhangs"
}
```

<br/>
zhangs鏄璇佺殑鐢ㄦ埛ID
	  		</td>
	  </tr>
 	 </table> 	



OAuth璁よ瘉鎺ュ彛灞炴€у垪琛?

<table   border="0" class="table table-striped table-bordered ">
   <tr >
	<th> 灞炴€у悕(Attribute) </th>
	<th> 鎻忚堪 </th>
	<th>鏁版嵁绫诲瀷</th>
  </tr>
  <tr>
	<td>uid</td>
	<td>uid</td>
	<td>瀛楃涓?/td>
  </tr>
 </table> 	

鍏朵粬璇峰弬鐓Auth2

