// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Chinese (`zh`).
class AppLocalizationsZh extends AppLocalizations {
  AppLocalizationsZh([String locale = 'zh']) : super(locale);

  @override
  String get homePageNewTotpBtnScanPage => '录入时间令牌';

  @override
  String get homePagenewTotpBtnErr => '不支持的二维码';

  @override
  String get homePagenewTotpBtn => '录入时间令牌';

  @override
  String get homePageTotpListViewNoTOTP => '没有时间令牌';

  @override
  String get homePageTotpListViewConfirmDialog => '删除选中的时间令牌？';

  @override
  String get homePageTotpListViewConfirmDialogCancelBtn => '取消';

  @override
  String get homePageTotpListViewConfirmDialogConfirmBtn => '确认';

  @override
  String get homePageUserCardGreetingMorning => '早上好';

  @override
  String get homePageUserCardGreetingNoon => '中午好';

  @override
  String get homePageUserCardGreetingAfternoon => '下午好';

  @override
  String get homePageUserCardGreetingEvening => '晚上好';

  @override
  String get homePageUserCardScanPage => '扫码登录';

  @override
  String get homePageUserCardScanSucceed => '登录成功';

  @override
  String get loginPageSettingBtn => '设置';

  @override
  String get loginPageLoginViewUsername => '用户名';

  @override
  String get loginPageLoginViewPassword => '密码';

  @override
  String get loginPageLoginViewCaptcha => '验证码';

  @override
  String get loginPageLoginViewLoginBtn => '登录';

  @override
  String get settingsPageTitle => '设置';

  @override
  String get settingsPageHostSettingDialog => '指定主机';

  @override
  String get settingsPageHostSettingDialogHost => '主机地址';

  @override
  String get settingsPageHostSettingDialogTestSucceed => '连接成功';

  @override
  String get settingsPageHostSettingDialogTestFail => '连接失败';

  @override
  String get settingsPageHostSettingDialogTestBtn => '验证';

  @override
  String get settingsPageHostSettingDialogCancleBtn => '取消';

  @override
  String get settingsPageHostSettingDialogConfirmBtn => '确认';

  @override
  String get settingsPageHostSettingTitle => '指定主机';

  @override
  String get settingsPageHostSettingDesc =>
      '如果网络状态良好但 ZERON 仍无法正常工作，可能需要修改此项设置';

  @override
  String get settingsPageShowLogBtnTitle => '查看日志';

  @override
  String get settingsPageLogDisplayPageTitle => '查看日志';

  @override
  String get settingsPageThemeModeSwitchTitle => '主题模式';

  @override
  String get userPageFullUserInfoDialogTitle => '详细信息';

  @override
  String get userPageFullUserInfoDialogDisplayName => '姓名';

  @override
  String get userPageFullUserInfoDialogUsername => '登录账号';

  @override
  String get userPageFullUserInfoDialogGender => '性别';

  @override
  String get userPageFullUserInfoDialogEmployeeNumber => '员工编号';

  @override
  String get userPageFullUserInfoDialogMobile => '手机号码';

  @override
  String get userPageFullUserInfoDialogEmail => '邮箱';

  @override
  String get userPageFullUserInfoDialogUserType => '用户类型';

  @override
  String get userPageFullUserInfoDialogUserState => '用户状态';

  @override
  String get userPageFullUserInfoDialogIdType => '证件类型';

  @override
  String get userPageFullUserInfoDialogIdCardNo => '证件号码';

  @override
  String get userPageFullUserInfoDialogMarried => '婚姻状态';

  @override
  String get userPageFullUserInfoDialogBirth => '出生日期';

  @override
  String get userPageFullUserInfoDialogOrganization => '所属组织';

  @override
  String get userPageFullUserInfoDialogDivision => '分支机构';

  @override
  String get userPageFullUserInfoDialogDepartmentId => '部门编号';

  @override
  String get userPageFullUserInfoDialogDepartment => '部门名称';

  @override
  String get userPageFullUserInfoDialogJobTitle => '职位';

  @override
  String get userPageFullUserInfoDialogJobLevel => '级别';

  @override
  String get userPageFullUserInfoDialogManager => '上级经理';

  @override
  String get userPageTitle => '用户';

  @override
  String get userPageUserInfoBtn => '详细信息';

  @override
  String get userPageSettingsBtn => '设置';

  @override
  String get userPageLogoutBtn => '退出账号';

  @override
  String get scanPagePermissionDeniedMsg =>
      '未授予摄像头权限。\nZERON 需要摄像头权限以扫描二维码并获取时间令牌。';
}
