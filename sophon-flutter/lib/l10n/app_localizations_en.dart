// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get homePageNewTotpBtnScanPage => 'Scan TOTP';

  @override
  String get homePagenewTotpBtnErr => 'Unsupported QR code';

  @override
  String get homePagenewTotpBtn => 'Scan TOTP';

  @override
  String get homePageTotpListViewNoTOTP => 'No TOTP';

  @override
  String get homePageTotpListViewConfirmDialog => 'Confirm to delete';

  @override
  String get homePageTotpListViewConfirmDialogCancelBtn => 'Cancel';

  @override
  String get homePageTotpListViewConfirmDialogConfirmBtn => 'Confirm';

  @override
  String get homePageUserCardGreetingMorning => 'Morning';

  @override
  String get homePageUserCardGreetingNoon => 'Noon';

  @override
  String get homePageUserCardGreetingAfternoon => 'Afternoon';

  @override
  String get homePageUserCardGreetingEvening => 'Evening';

  @override
  String get homePageUserCardScanPage => 'Scan to login';

  @override
  String get homePageUserCardScanSucceed => 'Succeed';

  @override
  String get loginPageSettingBtn => 'Settings';

  @override
  String get loginPageLoginViewUsername => 'Username';

  @override
  String get loginPageLoginViewPassword => 'Password';

  @override
  String get loginPageLoginViewCaptcha => 'Captcha';

  @override
  String get loginPageLoginViewLoginBtn => 'Login';

  @override
  String get settingsPageTitle => 'Settings';

  @override
  String get settingsPageHostSettingDialog => 'Specify host';

  @override
  String get settingsPageHostSettingDialogHost => 'Host';

  @override
  String get settingsPageHostSettingDialogTestSucceed => 'Succeed';

  @override
  String get settingsPageHostSettingDialogTestFail => 'Fail';

  @override
  String get settingsPageHostSettingDialogTestBtn => 'Test';

  @override
  String get settingsPageHostSettingDialogCancleBtn => 'Cancle';

  @override
  String get settingsPageHostSettingDialogConfirmBtn => 'Confirm';

  @override
  String get settingsPageHostSettingTitle => 'Specify host';

  @override
  String get settingsPageHostSettingDesc =>
      'If MaxKey is not working properly, you may need to change this';

  @override
  String get settingsPageShowLogBtnTitle => 'Check log';

  @override
  String get settingsPageLogDisplayPageTitle => 'Check log';

  @override
  String get settingsPageThemeModeSwitchTitle => 'Theme';

  @override
  String get userPageFullUserInfoDialogTitle => 'User info';

  @override
  String get userPageFullUserInfoDialogDisplayName => 'Name';

  @override
  String get userPageFullUserInfoDialogUsername => 'Username';

  @override
  String get userPageFullUserInfoDialogGender => 'Gender';

  @override
  String get userPageFullUserInfoDialogEmployeeNumber => 'Employee ID';

  @override
  String get userPageFullUserInfoDialogMobile => 'Mobile';

  @override
  String get userPageFullUserInfoDialogEmail => 'Email';

  @override
  String get userPageFullUserInfoDialogUserType => 'User type';

  @override
  String get userPageFullUserInfoDialogUserState => 'User state';

  @override
  String get userPageFullUserInfoDialogIdType => 'ID type';

  @override
  String get userPageFullUserInfoDialogIdCardNo => 'ID card Nunber';

  @override
  String get userPageFullUserInfoDialogMarried => 'Married';

  @override
  String get userPageFullUserInfoDialogBirth => 'Birth date';

  @override
  String get userPageFullUserInfoDialogOrganization => 'Organization';

  @override
  String get userPageFullUserInfoDialogDivision => 'Division';

  @override
  String get userPageFullUserInfoDialogDepartmentId => 'Department ID';

  @override
  String get userPageFullUserInfoDialogDepartment => 'Department';

  @override
  String get userPageFullUserInfoDialogJobTitle => 'Job title';

  @override
  String get userPageFullUserInfoDialogJobLevel => 'Job level';

  @override
  String get userPageFullUserInfoDialogManager => 'Manager';

  @override
  String get userPageTitle => 'User';

  @override
  String get userPageUserInfoBtn => 'User info';

  @override
  String get userPageSettingsBtn => 'Settings';

  @override
  String get userPageLogoutBtn => 'Logout';

  @override
  String get scanPagePermissionDeniedMsg =>
      'Camera permissions are not granted.MaxKey requires camera permissions to scan the QR code and obtain a TOTP.';
}
