# ZeronEdge - React 绠＄悊鎺у埗鍙?

鍩轰簬 Sophon 鐨勭幇浠ｅ寲 IAM 绠＄悊鎺у埗鍙帮紝閲囩敤 React + TypeScript + Ant Design Pro 鏋勫缓锛?00% 澶嶅埢 Sophon Angular 鐗堟湰鍔熻兘銆?

## 鉁?鐗规€?

- 馃帹 **鐜颁唬鍖?UI** - Ant Design 5 + Ant Design Pro Components
- 馃殌 **楂樻€ц兘** - Vite 5 鏋勫缓锛屼唬鐮佸垎鍓诧紝鎳掑姞杞?
- 馃敀 **绫诲瀷瀹夊叏** - TypeScript 5 涓ユ牸妯″紡
- 馃摫 **鍝嶅簲寮忚璁?* - 閫傞厤鍚勭灞忓箷灏哄
- 馃幆 **鍔熻兘瀹屾暣** - 100% 鍏煎 Sophon 鍚庣 API

## 馃摝 鎶€鏈爤

- **React 18.2** + **TypeScript 5.3** + **Vite 5.0**
- **Ant Design 5.12** + **Ant Design Pro Components 2.6**
- **React Router 6.21** + **Axios 1.6** + **Less 4.2**

## 馃殌 蹇€熷紑濮?

### 鐜瑕佹眰
- Node.js >= 18
- npm >= 9

### 鍚姩鍚庣鏈嶅姟
```powershell
cd C:\d\flutter_ws\sophon-sso\Sophon\docker
docker-compose up -d
```

**鏈嶅姟绔彛**:
- Sophon 绠＄悊鏈嶅姟: http://localhost:9526
- Sophon 璁よ瘉鏈嶅姟: http://localhost:9527

### 鍚姩鍓嶇
```bash
cd sophon-web-mgt-app
npm install          # 棣栨杩愯
npm run dev          # 寮€鍙戞ā寮?
```

璁块棶: http://localhost:8526

**榛樿鐧诲綍**: admin / Sophon

### 鏋勫缓鐢熶骇鐗堟湰
```bash
npm run build        # 鏋勫缓
npm run preview      # 棰勮
```

## 馃搧 椤圭洰缁撴瀯

```
sophon-web-mgt-app/
鈹溾攢鈹€ src/
鈹?  鈹溾攢鈹€ pages/              # 椤甸潰缁勪欢
鈹?  鈹?  鈹溾攢鈹€ user/           # 鐢ㄦ埛绠＄悊
鈹?  鈹?  鈹溾攢鈹€ organization/    # 缁勭粐绠＄悊
鈹?  鈹?  鈹溾攢鈹€ group/          # 鐢ㄦ埛缁勭鐞?
鈹?  鈹?  鈹溾攢鈹€ application/    # 搴旂敤绠＄悊
鈹?  鈹?  鈹溾攢鈹€ role/           # 瑙掕壊绠＄悊
鈹?  鈹?  鈹溾攢鈹€ permissions/    # 鏉冮檺绠＄悊
鈹?  鈹?  鈹溾攢鈹€ session/        # 鍦ㄧ嚎浼氳瘽
鈹?  鈹?  鈹溾攢鈹€ audit/          # 瀹¤鏃ュ織
鈹?  鈹?  鈹溾攢鈹€ config/         # 绯荤粺閰嶇疆
鈹?  鈹?  鈹斺攢鈹€ Dashboard.tsx   # 浠〃鏉?
鈹?  鈹溾攢鈹€ services/           # API 鏈嶅姟灞?
鈹?  鈹?  鈹溾攢鈹€ base.service.ts # 鍩虹鏈嶅姟绫?
鈹?  鈹?  鈹溾攢鈹€ user.ts
鈹?  鈹?  鈹溾攢鈹€ organizations.service.ts
鈹?  鈹?  鈹溾攢鈹€ groups.service.ts
鈹?  鈹?  鈹溾攢鈹€ apps.service.ts
鈹?  鈹?  鈹溾攢鈹€ roles.service.ts
鈹?  鈹?  鈹溾攢鈹€ resources.service.ts
鈹?  鈹?  鈹溾攢鈹€ permissions.service.ts
鈹?  鈹?  鈹溾攢鈹€ sessions.service.ts
鈹?  鈹?  鈹斺攢鈹€ ...
鈹?  鈹溾攢鈹€ types/              # TypeScript 绫诲瀷
鈹?  鈹?  鈹斺攢鈹€ entity.ts
鈹?  鈹溾攢鈹€ layouts/            # 甯冨眬缁勪欢
鈹?  鈹?  鈹溾攢鈹€ BasicLayout.tsx
鈹?  鈹?  鈹斺攢鈹€ UserLayout.tsx
鈹?  鈹溾攢鈹€ utils/              # 宸ュ叿鍑芥暟
鈹?  鈹?  鈹斺攢鈹€ request.ts      # Axios 灏佽
鈹?  鈹斺攢鈹€ App.tsx              # 鏍圭粍浠?
鈹溾攢鈹€ package.json
鈹斺攢鈹€ vite.config.ts
```

## 馃幆 鏍稿績鍔熻兘

### 1. 韬唤绠＄悊 (IDM)
- 鉁?**鐢ㄦ埛绠＄悊** - 鐢ㄦ埛鍒楄〃銆佹柊澧炪€佺紪杈戙€佸垹闄ゃ€佸瘑鐮佺鐞嗐€佹壒閲忔搷浣?
- 鉁?**缁勭粐绠＄悊** - 鏍戝舰缁勭粐缁撴瀯銆佸眰绾х鐞嗐€丆RUD 鎿嶄綔
- 鉁?**鐢ㄦ埛缁勭鐞?* - 闈欐€佺粍銆佸姩鎬佺粍銆佹垚鍛樼鐞嗭紙Transfer 绌挎妗嗭級

### 2. 搴旂敤绠＄悊
- 鉁?**搴旂敤鍒楄〃** - 澶氬崗璁敮鎸侊紙OAuth 2.0, SAML 2.0, CAS, JWT, Form Based, Token Based锛?
- 鉁?**鍗忚閰嶇疆** - 鍚勫崗璁缁嗗弬鏁伴厤缃?
- 鉁?**搴旂敤鐘舵€?* - 鍚敤/鍋滅敤绠＄悊銆佸浘鏍囧睍绀?

### 3. 鏉冮檺绠＄悊
- 鉁?**瑙掕壊绠＄悊** - 瑙掕壊 CRUD銆佹垚鍛樺垎閰嶃€佸姩鎬佽鑹插埛鏂?
- 鉁?**璧勬簮绠＄悊** - 璧勬簮鏍戝舰缁撴瀯銆丆RUD 鎿嶄綔
- 鉁?**鏉冮檺鍒嗛厤** - 鐢ㄦ埛缁?璧勬簮鏉冮檺鐭╅樀銆佹潈闄愭巿浜?鎾ら攢

### 4. 璁块棶鎺у埗
- 鉁?**鍦ㄧ嚎浼氳瘽** - 瀹炴椂浼氳瘽鐩戞帶銆佸崟涓?鎵归噺寮哄埗涓嬬嚎

### 5. 瀹¤鏃ュ織
- 鉁?**鐧诲綍鏃ュ織** - 鐧诲綍璁板綍鏌ヨ銆佸璁¤拷韪?
- 鉁?**璁块棶鏃ュ織** - 搴旂敤璁块棶璁板綍
- 鉁?**鍚屾鍣ㄦ棩蹇?* - 鍚屾鍣ㄦ墽琛岃褰?
- 鉁?**杩炴帴鍣ㄦ棩蹇?* - 杩炴帴鍣ㄦ墽琛岃褰?
- 鉁?**绯荤粺鏃ュ織** - 绯荤粺鎿嶄綔鏃ュ織

### 6. 绯荤粺閰嶇疆
- 鉁?**鏈烘瀯閰嶇疆** - 鍩烘湰淇℃伅绠＄悊
- 鉁?**瀵嗙爜绛栫暐** - 澶嶆潅搴︺€佹湁鏁堟湡璁剧疆
- 鉁?**LDAP閰嶇疆** - LDAP 杩炴帴閰嶇疆銆佹祴璇曡繛鎺?
- 鉁?**鐢靛瓙閭** - SMTP 閰嶇疆
- 鉁?**鐭俊鏈嶅姟** - 鐭俊鏈嶅姟鍟嗛厤缃?
- 鉁?**璐﹀彿绠＄悊** - 璐﹀彿绛栫暐绠＄悊
- 鉁?**鍚屾鍣ㄧ鐞?* - 鍚屾鍣ㄩ厤缃?
- 鉁?**杩炴帴鍣ㄧ鐞?* - 杩炴帴鍣ㄩ厤缃?
- 鉁?**绀句氦鐧诲綍** - 绀句氦鐧诲綍鏈嶅姟鍟嗛厤缃?

## 馃攲 API 閰嶇疆

### 鍚庣鏈嶅姟
- **Sophon 绠＄悊鏈嶅姟**: http://localhost:9526
- **Sophon 璁よ瘉鏈嶅姟**: http://localhost:9527

### 浠ｇ悊閰嶇疆 (vite.config.ts)
```typescript
proxy: {
  '/Sophon-mgt-api': {
    target: 'http://localhost:9526',
    changeOrigin: true,
  },
}
```

### API 鍝嶅簲鏍煎紡
```typescript
{
  "code": 0,          // 0 琛ㄧず鎴愬姛
  "message": "鎴愬姛",
  "data": {           // 瀹為檯鏁版嵁
    "rows": [...],    // 鏁版嵁鍒楄〃
    "records": 100    // 鎬昏褰曟暟
  }
}
```

## 馃帹 Ant Design Pro 缁勪欢

### 甯冨眬缁勪欢
- `PageContainer` - 鏍囧噯椤甸潰瀹瑰櫒锛堟敮鎸?tabList銆乥readcrumb锛?
- `ProCard` - 鍗＄墖瀹瑰櫒
- `ProTable` - 楂樼骇琛ㄦ牸锛堟悳绱€佸垎椤点€佹搷浣滐級
- `ProForm` / `ModalForm` - 楂樼骇琛ㄥ崟

### 琛ㄥ崟缁勪欢
- `ProFormText` / `ProFormTextArea` - 鏂囨湰杈撳叆
- `ProFormSelect` - 涓嬫媺閫夋嫨
- `ProFormTreeSelect` - 鏍戝舰閫夋嫨
- `ProFormRadio` - 鍗曢€夋
- `ProFormDigit` - 鏁板瓧杈撳叆
- `ProFormSwitch` - 寮€鍏?
- `ProFormDatePicker` - 鏃ユ湡閫夋嫨

### 鏁版嵁灞曠ず
- `Image` - 鍥剧墖灞曠ず
- `Tag` - 鏍囩
- `Transfer` - 绌挎妗嗭紙鎴愬憳绠＄悊锛?
- `Tree` - 鏍戝舰缁勪欢锛堢粍缁囨爲銆佽祫婧愭爲锛?

## 馃敡 寮€鍙戞寚鍗?

### 娣诲姞鏂伴〉闈?

1. **鍒涘缓椤甸潰缁勪欢**
```typescript
// src/pages/example/ExamplePage.tsx
import { PageContainer, ProTable } from '@ant-design/pro-components';

const ExamplePage: React.FC = () => {
  return (
    <PageContainer
      header={{
        title: '绀轰緥椤甸潰',
        breadcrumb: {
          items: [
            { title: '棣栭〉' },
            { title: '绀轰緥' },
          ],
        },
      }}
    >
      <ProTable
        columns={[...]}
        request={loadData}
        rowKey="id"
      />
    </PageContainer>
  );
};

export default ExamplePage;
```

2. **娣诲姞璺敱** (`App.tsx`)
```typescript
const ExamplePage = lazy(() => import('@/pages/example/ExamplePage'));

<Route path="example" element={<ExamplePage />} />
```

3. **娣诲姞鑿滃崟** (`BasicLayout.tsx`)
```typescript
{
  key: '/example',
  icon: <AppstoreOutlined />,
  label: '绀轰緥',
}
```

### 娣诲姞鏂版湇鍔?

```typescript
// src/services/example.service.ts
import { BaseService } from './base.service';
import { ExampleEntity } from '@/types/entity';

class ExampleService extends BaseService<ExampleEntity> {
  constructor() {
    super('/Sophon-mgt-api/example');
  }

  // 娣诲姞鐗瑰畾鏂规硶
  async customMethod(id: string) {
    return this.request.get(`${this.baseUrl}/custom/${id}`);
  }
}

export default new ExampleService();
```

## 馃帹 涓婚瀵嗗害閰嶇疆

椤圭洰鎻愪緵浜嗕笁绉嶄富棰樺瘑搴﹂€夐」锛屽彲鍏ㄥ眬鎺у埗 Ant Design Pro 缁勪欢鐨勯棿璺濆拰甯冨眬锛?

- **瀹芥澗锛坙oose锛?*锛氶€傚悎闇€瑕佹洿澶氱暀鐧界殑鍦烘櫙
- **涓瓑锛坢edium锛?*锛氬钩琛＄殑闂磋窛锛岄€傚悎澶у鏁板満鏅?
- **绱у噾锛坈ompact锛?*锛氭渶灏忛棿璺濓紝閫傚悎闇€瑕佹樉绀烘洿澶氬唴瀹圭殑鍦烘櫙锛堝綋鍓嶉粯璁わ級

### 淇敼涓婚瀵嗗害

缂栬緫 `src/styles/theme.less` 鏂囦欢锛屼慨鏀?`@density` 鍙橀噺锛?

```less
@density: compact; // 鍙€夊€硷細loose | medium | compact
```

淇敼鍚庨渶瑕侀噸鏂扮紪璇戞牱寮忔枃浠舵墠鑳界敓鏁堛€?

### 涓婚鍙橀噺璇存槑

姣忕瀵嗗害涓婚閮藉畾涔変簡浠ヤ笅鍙橀噺锛?
- **PageContainer**锛氶〉闈㈠鍣ㄧ殑鍐呰竟璺?
- **Card**锛氬崱鐗囩殑澶撮儴銆佷富浣撳唴杈硅窛鍜屽簳閮ㄩ棿璺?
- **Table**锛氳〃鏍煎崟鍏冩牸鍜屽伐鍏锋爮鐨勫唴杈硅窛
- **Form**锛氳〃鍗曢」鐨勯棿璺濆拰鏍囩鍐呰竟璺?
- **Modal**锛氭ā鎬佹鐨勫ご閮ㄣ€佷富浣撳拰搴曢儴鍐呰竟璺?
- **Tabs**锛氭爣绛鹃〉鐨勫唴杈硅窛
- **Space**锛氶棿璺濈粍浠剁殑闂磋窛澶у皬
- **Row**锛氳缁勪欢鐨勯粯璁?gutter 鍊?

### 鑷畾涔夋牱寮?

濡傛灉闇€瑕佽嚜瀹氫箟鏌愪釜缁勪欢鐨勯棿璺濓紝鍙互鍦?`src/styles/global.less` 涓洿鎺ヨ鐩栨牱寮忥紝浣跨敤 `!important` 纭繚浼樺厛绾с€?

## 馃搳 鍔熻兘瀹屾垚搴?

### 鏈嶅姟灞? 鉁?100%
- 14+ 涓牳蹇冩湇鍔＄被
- 60+ API 鏂规硶
- 瀹屾暣鐨?CRUD 鎿嶄綔

### 绫诲瀷绯荤粺: 鉁?100%
- 20+ 瀹炰綋鎺ュ彛
- 瀹屾暣瀛楁瀹氫箟

### 椤甸潰缁勪欢: 鉁?100%
- 鐢ㄦ埛绠＄悊銆佺粍缁囩鐞嗐€佺敤鎴风粍绠＄悊
- 搴旂敤绠＄悊銆佽鑹茬鐞嗐€佽祫婧愮鐞嗐€佹潈闄愬垎閰?
- 鍦ㄧ嚎浼氳瘽銆佸璁℃棩蹇楋紙5绉嶇被鍨嬶級
- 绯荤粺閰嶇疆锛?涓ā鍧楋級

## 馃悰 鏁呴殰鎺掗櫎

### 绔彛鍐茬獊
淇敼 `vite.config.ts`:
```typescript
server: {
  port: 8528,  // 鏀逛负鍏朵粬绔彛
}
```

### API 璇锋眰澶辫触
1. 妫€鏌ュ悗绔湇鍔℃槸鍚﹀惎鍔?
2. 楠岃瘉浠ｇ悊閰嶇疆鏄惁姝ｇ‘
3. 鏌ョ湅娴忚鍣ㄦ帶鍒跺彴缃戠粶璇锋眰

### 鏍峰紡寮傚父
```bash
rm -rf node_modules
npm install
```

## 馃摎 鐩稿叧閾炬帴

- [Ant Design Pro 鏂囨。](https://pro.ant.design/)
- [Sophon 瀹樻柟鏂囨。](https://Sophon.top/)
- [React 瀹樻柟鏂囨。](https://react.dev)
- [Vite 瀹樻柟鏂囨。](https://vitejs.dev)

## 馃摑 鏇存柊鏃ュ織

### v1.0.0 (2024-11-22)
- 鉁?瀹屾垚鎵€鏈夋牳蹇冮〉闈㈢粍浠?
- 鉁?瀹屾垚鏈嶅姟灞傛灦鏋勶紙14+ 鏈嶅姟锛?
- 鉁?瀹屾垚绫诲瀷绯荤粺锛?0+ 瀹炰綋锛?
- 鉁?閲囩敤 Ant Design Pro 缁勪欢
- 鉁?浠ｇ爜鍒嗗壊鍜屾噿鍔犺浇
- 鉁?TypeScript 绫诲瀷瀹夊叏

## 馃懃 鍥㈤槦

**ZeronEdge Team**

## 馃搫 璁稿彲璇?

MIT

## 馃悰 甯歌閿欒澶勭悊

### "Clock moved backwards" 閿欒鍒嗘瀽

#### 閿欒淇℃伅
```json
{
    "code": 2,
    "message": "Clock moved backwards. Refusing to generate id",
    "data": null
}
```

#### 閿欒鏉ユ簮

閿欒鏉ヨ嚜 `SnowFlakeId.java` 鐨?`nextId()` 鏂规硶銆係nowflake 绠楁硶渚濊禆绯荤粺鏃堕棿鎴崇敓鎴愬敮涓€ ID銆傚綋妫€娴嬪埌褰撳墠鏃堕棿鎴冲皬浜庝笂娆¤褰曠殑鏃堕棿鎴虫椂锛屼細鎶涘嚭姝ゅ紓甯革紝浠ラ槻姝㈢敓鎴愰噸澶嶇殑 ID銆?

#### 鍙兘鐨勫師鍥?

1. **绯荤粺鏃堕挓琚墜鍔ㄨ皟鏁?*
   - 鏈嶅姟鍣ㄧ鐞嗗憳鎵嬪姩淇敼浜嗙郴缁熸椂闂?
   - 鏃堕棿琚悜鍚庤皟鏁达紙渚嬪浠?2024-01-02 璋冩暣鍒?2024-01-01锛?

2. **NTP 鏃堕棿鍚屾闂**
   - NTP 鏈嶅姟鍣ㄦ椂闂翠笉姝ｇ‘
   - 缃戠粶寤惰繜瀵艰嚧鏃堕棿鍚屾璺宠穬
   - NTP 瀹㈡埛绔厤缃敊璇?

3. **铏氭嫙鏈?瀹瑰櫒鏃堕棿鍚屾闂**
   - Docker 瀹瑰櫒鏃堕棿涓庡涓绘満涓嶅悓姝?
   - 铏氭嫙鏈烘殏鍋?鎭㈠鍚庢椂闂翠笉鍚屾
   - 瀹瑰櫒閲嶅惎鍚庢椂闂撮噸缃?

4. **鏈嶅姟鍣ㄩ噸鍚棶棰?*
   - 鏈嶅姟鍣ㄩ噸鍚悗 BIOS 鏃堕棿涓嶆纭?
   - 鏃跺尯閰嶇疆閿欒

5. **澶氭湇鍔″櫒鏃堕棿涓嶄竴鑷?*
   - 闆嗙兢鐜涓笉鍚屾湇鍔″櫒鏃堕棿涓嶅悓姝?
   - 璐熻浇鍧囪　瀵艰嚧璇锋眰鍦ㄤ笉鍚屾椂闂村樊鐨勬湇鍔″櫒闂村垏鎹?

#### 瑙ｅ喅鏂规

##### 1. 妫€鏌ョ郴缁熸椂闂村悓姝?

```bash
# 妫€鏌ュ綋鍓嶇郴缁熸椂闂?
date

# 妫€鏌?NTP 鍚屾鐘舵€侊紙Linux锛?
timedatectl status
ntpq -p

# 妫€鏌?NTP 鍚屾鐘舵€侊紙Windows锛?
w32tm /query /status
```

##### 2. 閰嶇疆 NTP 鏃堕棿鍚屾

**Linux:**
```bash
# 瀹夎 NTP
sudo apt-get install ntp  # Ubuntu/Debian
sudo yum install ntp     # CentOS/RHEL

# 鍚姩 NTP 鏈嶅姟
sudo systemctl start ntpd
sudo systemctl enable ntpd

# 鎴栬€呬娇鐢?systemd-timesyncd
sudo timedatectl set-ntp true
```

**Windows:**
```powershell
# 閰嶇疆 Windows 鏃堕棿鏈嶅姟
w32tm /config /manualpeerlist:"pool.ntp.org" /syncfromflags:manual /reliable:YES /update
w32tm /resync
```

##### 3. Docker 瀹瑰櫒鏃堕棿鍚屾

```yaml
# docker-compose.yml
services:
  Sophon:
    image: Sophon/Sophon
    volumes:
      - /etc/localtime:/etc/localtime:ro  # 鍚屾瀹夸富鏈烘椂闂?
    environment:
      - TZ=Asia/Shanghai  # 璁剧疆鏃跺尯
```

##### 4. 淇敼 Snowflake 瀹炵幇锛堜复鏃舵柟妗堬級

濡傛灉闇€瑕佸蹇嶆椂閽熷洖閫€锛屽彲浠ヤ慨鏀?`SnowFlakeId.java`锛?

```java
public synchronized long nextId() {
    long currStmp = getNewstmp();
    if (currStmp < lastStmp) {
        // 鏂规1: 绛夊緟鏃堕挓杩戒笂
        long offset = lastStmp - currStmp;
        if (offset <= 5) {  // 鍏佽5姣鍐呯殑鍥為€€
            try {
                Thread.sleep(offset + 1);
                currStmp = getNewstmp();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Interrupted during clock adjustment", e);
            }
        } else {
            // 鏂规2: 璁板綍璀﹀憡骞剁户缁紙涓嶆帹鑽愶紝鍙兘瀵艰嚧ID閲嶅锛?
            logger.warn("Clock moved backwards by {} ms, adjusting", offset);
            lastStmp = currStmp;
        }
    }
    // ... 鍘熸湁閫昏緫
}
```

**娉ㄦ剰锛?* 淇敼绠楁硶鍙兘瀵艰嚧 ID 閲嶅锛屼笉鎺ㄨ崘鍦ㄧ敓浜х幆澧冧娇鐢ㄣ€?

##### 5. 浣跨敤鍏朵粬 ID 鐢熸垚绛栫暐

鍦?`application.properties` 涓厤缃細

```properties
# 浣跨敤 UUID 鑰屼笉鏄?Snowflake
Sophon.id.strategy=UUID
```

##### 6. 鐩戞帶鍜屽憡璀?

寤鸿娣诲姞鐩戞帶鏉ユ娴嬫椂闂村悓姝ラ棶棰橈細

```bash
# 鐩戞帶鑴氭湰绀轰緥
#!/bin/bash
TIME_DIFF=$(ntpdate -q pool.ntp.org 2>&1 | grep "offset" | awk '{print $10}')
if [ $(echo "$TIME_DIFF > 1.0" | bc) -eq 1 ]; then
    echo "WARNING: Time offset is $TIME_DIFF seconds"
    # 鍙戦€佸憡璀?
fi
```

#### 棰勯槻鎺柦

1. **瀹氭湡妫€鏌ユ椂闂村悓姝?*
   - 璁剧疆瀹氭椂浠诲姟妫€鏌?NTP 鍚屾鐘舵€?
   - 鐩戞帶绯荤粺鏃堕棿鍋忕Щ

2. **浣跨敤鍙潬鐨勬椂闂存簮**
   - 閰嶇疆澶氫釜 NTP 鏈嶅姟鍣?
   - 浣跨敤鏈湴 NTP 鏈嶅姟鍣紙濡傛灉鏈夛級

3. **瀹瑰櫒鐜**
   - 纭繚瀹瑰櫒鏃堕棿涓庡涓绘満鍚屾
   - 浣跨敤 `--privileged` 妯″紡锛堣皑鎱庝娇鐢級

4. **闆嗙兢鐜**
   - 纭繚鎵€鏈夎妭鐐规椂闂村悓姝?
   - 浣跨敤缁熶竴鐨勬椂闂存簮

#### 鐩稿叧閰嶇疆

Sophon 鐨?ID 鐢熸垚鍣ㄩ厤缃湪 `ApplicationAutoConfiguration.java`锛?

```java
@Bean
IdGenerator idGenerator(
    @Value("${Sophon.id.strategy:SnowFlake}") String strategy,
    @Value("${Sophon.id.datacenterId:0}") int datacenterId,
    @Value("${Sophon.id.machineId:0}") int machineId) {
    // ...
}
```

鍙互鍦?`application.properties` 涓厤缃細

```properties
# ID 鐢熸垚绛栫暐: SnowFlake 鎴?UUID
Sophon.id.strategy=SnowFlake
# 鏁版嵁涓績 ID (0-31)
Sophon.id.datacenterId=1
# 鏈哄櫒 ID (0-31)
Sophon.id.machineId=1
```

#### 鎬荤粨

杩欎釜閿欒鏄?Snowflake 绠楁硶鐨勪繚鎶ゆ満鍒讹紝鐢ㄤ簬闃叉鍦ㄦ椂閽熷洖閫€鏃剁敓鎴愰噸澶嶇殑 ID銆?*鏈€浣宠В鍐虫柟妗堟槸纭繚绯荤粺鏃堕棿姝ｇ‘鍚屾**锛岃€屼笉鏄慨鏀圭畻娉曢€昏緫銆?

## 馃檹 鑷磋阿

- [Sophon](https://Sophon.top/) - 鎻愪緵寮哄ぇ鐨?IAM 鍚庣
- [Ant Design](https://ant.design/) - 浼樼鐨?UI 缁勪欢搴?
- [Ant Design Pro](https://pro.ant.design/) - 浼佷笟绾т腑鍚庡彴瑙ｅ喅鏂规
- [Vite](https://vitejs.dev/) - 涓嬩竴浠ｅ墠绔瀯寤哄伐鍏?

