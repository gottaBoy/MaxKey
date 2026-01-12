# 璐＄尞浠ｇ爜

娆㈣繋鎮ㄥSophon椤圭洰鐨勮础鐚€?
鎴戜滑璇氭寶鐨勬劅璋綘鐨勮础鐚紝杩欎釜鏂囨。鎻忚堪浜嗘垜浠殑宸ヤ綔鏂瑰紡鍜屽伐浣滄祦绋嬶紝寮€鍙戣€呬篃鍙互鍚屾椂鍙傝€冨畼鏂圭殑鐩稿叧鏂囨。銆?

## Workflow

Sophon寮€鍙戜腑浣跨敤鍒扮殑鍑犵妯″瀷鍦ㄨ繖涓摼鎺ヤ笅杞?[鐐规垜](https://github.com/SophonTop/Sophon/archive/master.zip).  
涔嬪悗鏄础鐚唬鐮佺殑涓昏娴佺▼銆?

### Fork

* Sophon閲囩敤Pull Request鐨勬柟寮忔彁浜や唬鐮侊紝绂佹鐩存帴push锛屾墍鏈夌殑浠ｇ爜閮介渶瑕佷汉宸eview銆傞鍏堣fork涓€浠組axKey鐨勪唬鐮?["Fork" button](https://help.github.com/articles/fork-a-repo/).
* 璺宠浆鍒癧Sophon](https://github.com/SophonTop/Sophon) GitHub棣栭〉锛岀劧鍚庡崟鍑?`Fork` 鎸夐挳锛岀敓鎴愯嚜宸辩洰褰曚笅鐨勪粨搴擄紝姣斿 <https://github.com/浣犵殑鐢ㄦ埛鍚?Sophon>銆?

### Clone(鍏嬮殕)
灏嗚繙绋嬩粨搴?clone 鍒版湰鍦帮細

```bash
鉃? git clone https://github.com/浣犵殑鐢ㄦ埛鍚?Sophon
鉃? cd Sophon
```

### 鍒涘缓鏈湴鍒嗘敮

Sophon 鐩墠浣跨敤[Git娴佸垎鏀ā鍨媇(http://nvie.com/posts/a-successful-git-branching-model/)杩涜寮€鍙戯紝娴嬭瘯锛屽彂琛屽拰缁存姢

鎵€鏈夌殑 feature 鍜?bug fix 鐨勫紑鍙戝伐浣滈兘搴旇鍦ㄤ竴涓柊鐨勫垎鏀笂瀹屾垚锛屼竴鑸粠 `develop` 鍒嗘敮涓婂垱寤烘柊鍒嗘敮銆?

浣跨敤 `git checkout -b` 鍒涘缓骞跺垏鎹㈠埌鏂板垎鏀€?

```bash
鉃? git checkout -b my-cool-stuff
```

鍊煎緱娉ㄦ剰鐨勬槸锛屽湪 checkout 涔嬪墠锛岄渶瑕佷繚鎸佸綋鍓嶅垎鏀洰褰?clean锛屽惁鍒欎細鎶?untracked 鐨勬枃浠朵篃甯﹀埌鏂板垎鏀笂锛岃繖鍙互閫氳繃 `git status` 鏌ョ湅銆?

### 浣跨敤 `pre-commit` 閽╁瓙

Sophon 寮€鍙戜汉鍛樹娇鐢?[pre-commit](http://pre-commit.com/) 宸ュ叿鏉ョ鐞?Git 棰勬彁浜ら挬瀛愩€?鍦ㄦ彁浜わ紙commit锛夊墠鑷姩妫€鏌ヤ竴浜涘熀鏈簨瀹滐紙濡傛瘡涓枃浠跺彧鏈変竴涓?EOL锛孏it 涓笉瑕佹坊鍔犲ぇ鏂囦欢绛夛級銆?

`pre-commit`娴嬭瘯鏄崟鍏冩祴璇曠殑涓€閮ㄥ垎锛屼笉婊¤冻閽╁瓙鐨?PR 涓嶈兘琚彁浜ゅ埌 Sophon锛岄鍏堝畨瑁呭苟鍦ㄥ綋鍓嶇洰褰曡繍琛屽畠锛?

```bash
pip install pre-commit
pre-commit -v -a
```


## 寮€濮嬪紑鍙?

鍦ㄦ湰渚嬩腑锛屾垜鍒犻櫎浜?README.md 涓殑涓€琛岋紝骞跺垱寤轰簡涓€涓柊鏂囦欢銆?

閫氳繃 `git status` 鏌ョ湅褰撳墠鐘舵€侊紝杩欎細鎻愮ず褰撳墠鐩綍鐨勪竴浜涘彉鍖栵紝鍚屾椂涔熷彲浠ラ€氳繃 `git diff` 鏌ョ湅鏂囦欢鍏蜂綋琚慨鏀圭殑鍐呭銆?

```bash
鉃? git status
On branch test
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   README.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)

	test

no changes added to commit (use "git add" and/or "git commit -a")
```

## 鏋勫缓

閰嶇疆鐜鍙橀噺
gradleSetEnv.bat

set JAVA_HOME=D:\JavaIDE\jdk1.8.0_91

set GRADLE_HOME=D:\JavaIDE\gradle-5.4.1

鍚姩鏋勫缓
gradleBuildRelease.bat

鏋勫缓缁撴灉
鏋勫缓鍖呰矾寰?

Sophon/build/Sophon-jars

渚濊禆鍖呰矾寰?

Sophon/build/Sophon-depjars

鍏蜂綋寮€鍙戦厤缃弬瑙?https://Sophon.top/zh/development.html


## 鎻愪氦锛坈ommit锛?

鎺ヤ笅鏉ユ垜浠彇娑堝 README.md 鏂囦欢鐨勬敼鍙橈紝鐒跺悗鎻愪氦鏂版坊鍔犵殑 test 鏂囦欢銆?

```bash
鉃? git checkout -- README.md
鉃? git status
On branch test
Untracked files:
  (use "git add <file>..." to include in what will be committed)

	test

nothing added to commit but untracked files present (use "git add" to track)
鉃? git add test
```

Git 姣忔鎻愪氦浠ｇ爜锛岄兘闇€瑕佸啓鎻愪氦璇存槑锛岃繖鍙互璁╁叾浠栦汉鐭ラ亾杩欐鎻愪氦鍋氫簡鍝簺鏀瑰彉锛岃繖鍙互閫氳繃`git commit` 瀹屾垚銆?

```bash
鈻?pre-commit run -a -v
[remove-crlf] CRLF end-lines remover........................................Passed
[remove-tabs] Tabs remover..................................................Passed
[check-added-large-files] Check for added large files.......................Passed
[check-merge-conflict] Check for merge conflicts............................Passed
[check-symlinks] Check for broken symlinks..................................Passed
[detect-private-key] Detect Private Key.....................................Passed
[end-of-file-fixer] Fix End of Files........................................Passed
[trailing-whitespace] Trim Trailing Whitespace..............................Passed
[copyright] copyright.......................................................Passed
[clang-format] clang-format.................................................Passed
```

## 淇濇寔鏈湴浠撳簱鏈€鏂?

鍦ㄥ噯澶囧彂璧?Pull Request 涔嬪墠锛岄渶瑕佸悓姝ュ師浠撳簱锛?https://github.com/SophonTop/Sophon>锛夋渶鏂扮殑浠ｇ爜銆?

棣栧厛閫氳繃 `git remote` 鏌ョ湅褰撳墠杩滅▼浠撳簱鐨勫悕瀛椼€?

```bash
鉃? git remote
origin
鉃? git remote -v
origin	https://github.com/USERNAME/Sophon (fetch)
origin	https://github.com/USERNAME/Sophon (push)
```

杩欓噷 origin 鏄垜浠?clone 鐨勮繙绋嬩粨搴撶殑鍚嶅瓧锛屼篃灏辨槸鑷繁鐢ㄦ埛鍚嶄笅鐨?Sophon锛屾帴涓嬫潵鎴戜滑鍒涘缓涓€涓師濮?Sophon 浠撳簱鐨勮繙绋嬩富鏈猴紝鍛藉悕涓?upstream銆?

```bash
鉃? git remote add upstream https://github.com/SophonTop/Sophon
鉃? git remote
origin
upstream
```

鑾峰彇 upstream 鐨勬渶鏂颁唬鐮佸苟鏇存柊褰撳墠鍒嗘敮銆?

```bash
鉃? git fetch upstream
鉃? git pull upstream develop
```

## Push 鍒拌繙绋嬩粨搴?

灏嗘湰鍦扮殑淇敼鎺ㄩ€佸埌 GitHub 涓婏紝涔熷氨鏄?https://github.com/USERNAME/Sophon銆?

```bash
# 鎺ㄩ€佸埌杩滅▼浠撳簱 origin 鐨?my-cool-stuff 鍒嗘敮涓?
鉃? git push origin my-cool-stuff
```

## 寤虹珛 Issue 骞跺畬鎴?Pull Request

寤虹珛涓€涓?Issue 鎻忚堪闂锛屽苟璁板綍瀹冪殑缂栧彿銆?

鍒囨崲鍒版墍寤哄垎鏀紝鐒跺悗鐐瑰嚮 `New pull request`銆?

鍦?PR 鐨勬弿杩拌鏄庝腑锛屽～鍐?`resolve #Issue缂栧彿` 鍙互鍦ㄨ繖涓?PR 琚?merge 鍚庯紝鑷姩鍏抽棴瀵瑰簲鐨?Issue
> 鍏蜂綋璇疯 <https://help.github.com/articles/closing-issues-via-commit-messages/>


## review



## 鍒犻櫎杩滅▼鍒嗘敮

鍦?PR 琚?merge 杩涗富浠撳簱鍚庯紝鎴戜滑鍙互鍦?PR 鐨勯〉闈㈠垹闄よ繙绋嬩粨搴撶殑鍒嗘敮銆?

涔熷彲浠ヤ娇鐢?`git push origin :鍒嗘敮鍚峘 鍒犻櫎杩滅▼鍒嗘敮锛屽锛?

```bash
鉃? git push origin :my-cool-stuff
```

## 鍒犻櫎鏈湴鍒嗘敮

鏈€鍚庯紝鍒犻櫎鏈湴鍒嗘敮銆?

```bash
# 鍒囨崲鍒?develop 鍒嗘敮
鉃? git checkout develop 

# 鍒犻櫎 my-cool-stuff 鍒嗘敮
鉃? git branch -D my-cool-stuff
```

鑷虫锛屾垜浠氨瀹屾垚浜嗕竴娆′唬鐮佽础鐚殑杩囩▼銆?

## 鎻愪氦浠ｇ爜鐨勪竴浜涚害瀹?

涓轰簡浣胯瘎瀹′汉鍦ㄨ瘎瀹′唬鐮佹椂鏇村ソ鍦颁笓娉ㄤ簬浠ｇ爜鏈韩锛岃鎮ㄦ瘡娆℃彁浜や唬鐮佹椂锛岄伒瀹堜互涓嬬害瀹氾細

1. 璇蜂繚璇佸崟鍏冩祴璇曡兘椤哄埄閫氳繃銆傚鏋滄病杩囷紝璇存槑鎻愪氦鐨勪唬鐮佸瓨鍦ㄩ棶棰橈紝璇勫浜轰竴鑸笉鍋氳瘎瀹°€?
2. 鎻愪氦Pull Request鍓嶏細
   - 璇锋敞鎰廲ommit鐨勬暟閲忥細
     - 鍘熷洜锛氬鏋滀粎浠呬慨鏀逛竴涓枃浠朵絾鎻愪氦浜嗗崄鍑犱釜commit锛屾瘡涓猚ommit鍙仛浜嗗皯閲忕殑淇敼锛岃繖浼氱粰璇勫浜哄甫鏉ュ緢澶у洶鎵般€傝瘎瀹′汉闇€瑕侀€愪竴鏌ョ湅姣忎釜commit鎵嶈兘鐭ラ亾鍋氫簡鍝簺淇敼锛屼笖涓嶆帓闄ommit涔嬮棿鐨勪慨鏀瑰瓨鍦ㄧ浉浜掕鐩栫殑鎯呭喌銆?
     - 寤鸿锛氭瘡娆℃彁浜ゆ椂锛屼繚鎸佸敖閲忓皯鐨刢ommit锛屽彲浠ラ€氳繃`git commit --amend`琛ュ厖涓婃鐨刢ommit銆傚宸茬粡Push鍒拌繙绋嬩粨搴撶殑澶氫釜commit锛屽彲浠ュ弬鑰僛squash commits after push](http://stackoverflow.com/questions/5667884/how-to-squash-commits-in-git-after-they-have-been-pushed)銆?
   - 璇锋敞鎰忔瘡涓猚ommit鐨勫悕绉帮細搴旇兘鍙嶆槧褰撳墠commit鐨勫唴瀹癸紝涓嶈兘澶殢鎰忋€?
3. 濡傛灉瑙ｅ喅浜嗘煇涓狪ssue鐨勯棶棰橈紝璇峰湪璇ull Request鐨?*绗竴涓?*璇勮妗嗕腑鍔犱笂锛歚fix #issue_number`锛岃繖鏍峰綋璇ull Request琚悎骞跺悗锛屼細鑷姩鍏抽棴瀵瑰簲鐨処ssue銆傚叧閿瘝鍖呮嫭锛歝lose, closes, closed, fix, fixes, fixed, resolve, resolves, resolved锛岃閫夋嫨鍚堥€傜殑璇嶆眹銆傝缁嗗彲鍙傝€僛Closing issues via commit messages](https://help.github.com/articles/closing-issues-via-commit-messages)銆?

姝ゅ锛屽湪鍥炲璇勫浜烘剰瑙佹椂锛岃鎮ㄩ伒瀹堜互涓嬬害瀹氾細

1. 璇勫浜虹殑姣忎釜鎰忚閮藉繀椤诲洖澶嶏紙杩欐槸寮€婧愮ぞ鍖虹殑鍩烘湰绀艰矊锛屽埆浜哄府浜嗗繖锛屽簲璇ヨ璋㈣阿锛夛細
   - 瀵硅瘎瀹℃剰瑙佸悓鎰忎笖鎸夊叾淇敼瀹岀殑锛岀粰涓畝鍗曠殑`Done`鍗冲彲锛?
   - 瀵硅瘎瀹℃剰瑙佷笉鍚屾剰鐨勶紝璇风粰鍑烘偍鑷繁鐨勫弽椹崇悊鐢便€?
2. 濡傛灉璇勫鎰忚姣旇緝澶氾細
   - 璇风粰鍑烘€讳綋鐨勪慨鏀规儏鍐点€?
   - 璇烽噰鐢╗start a review](https://help.github.com/articles/reviewing-proposed-changes-in-a-pull-request/)杩涜鍥炲锛岃€岄潪鐩存帴鍥炲鐨勬柟寮忋€傚師鍥犳槸姣忎釜鍥炲閮戒細鍙戦€佷竴灏侀偖浠讹紝浼氶€犳垚閭欢鐏鹃毦銆?



