import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_zh.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('zh'),
  ];

  /// No description provided for @homePageNewTotpBtnScanPage.
  ///
  /// In en, this message translates to:
  /// **'Scan TOTP'**
  String get homePageNewTotpBtnScanPage;

  /// No description provided for @homePagenewTotpBtnErr.
  ///
  /// In en, this message translates to:
  /// **'Unsupported QR code'**
  String get homePagenewTotpBtnErr;

  /// No description provided for @homePagenewTotpBtn.
  ///
  /// In en, this message translates to:
  /// **'Scan TOTP'**
  String get homePagenewTotpBtn;

  /// No description provided for @homePageTotpListViewNoTOTP.
  ///
  /// In en, this message translates to:
  /// **'No TOTP'**
  String get homePageTotpListViewNoTOTP;

  /// No description provided for @homePageTotpListViewConfirmDialog.
  ///
  /// In en, this message translates to:
  /// **'Confirm to delete'**
  String get homePageTotpListViewConfirmDialog;

  /// No description provided for @homePageTotpListViewConfirmDialogCancelBtn.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get homePageTotpListViewConfirmDialogCancelBtn;

  /// No description provided for @homePageTotpListViewConfirmDialogConfirmBtn.
  ///
  /// In en, this message translates to:
  /// **'Confirm'**
  String get homePageTotpListViewConfirmDialogConfirmBtn;

  /// No description provided for @homePageUserCardGreetingMorning.
  ///
  /// In en, this message translates to:
  /// **'Morning'**
  String get homePageUserCardGreetingMorning;

  /// No description provided for @homePageUserCardGreetingNoon.
  ///
  /// In en, this message translates to:
  /// **'Noon'**
  String get homePageUserCardGreetingNoon;

  /// No description provided for @homePageUserCardGreetingAfternoon.
  ///
  /// In en, this message translates to:
  /// **'Afternoon'**
  String get homePageUserCardGreetingAfternoon;

  /// No description provided for @homePageUserCardGreetingEvening.
  ///
  /// In en, this message translates to:
  /// **'Evening'**
  String get homePageUserCardGreetingEvening;

  /// No description provided for @homePageUserCardScanPage.
  ///
  /// In en, this message translates to:
  /// **'Scan to login'**
  String get homePageUserCardScanPage;

  /// No description provided for @homePageUserCardScanSucceed.
  ///
  /// In en, this message translates to:
  /// **'Succeed'**
  String get homePageUserCardScanSucceed;

  /// No description provided for @loginPageSettingBtn.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get loginPageSettingBtn;

  /// No description provided for @loginPageLoginViewUsername.
  ///
  /// In en, this message translates to:
  /// **'Username'**
  String get loginPageLoginViewUsername;

  /// No description provided for @loginPageLoginViewPassword.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get loginPageLoginViewPassword;

  /// No description provided for @loginPageLoginViewCaptcha.
  ///
  /// In en, this message translates to:
  /// **'Captcha'**
  String get loginPageLoginViewCaptcha;

  /// No description provided for @loginPageLoginViewLoginBtn.
  ///
  /// In en, this message translates to:
  /// **'Login'**
  String get loginPageLoginViewLoginBtn;

  /// No description provided for @settingsPageTitle.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get settingsPageTitle;

  /// No description provided for @settingsPageHostSettingDialog.
  ///
  /// In en, this message translates to:
  /// **'Specify host'**
  String get settingsPageHostSettingDialog;

  /// No description provided for @settingsPageHostSettingDialogHost.
  ///
  /// In en, this message translates to:
  /// **'Host'**
  String get settingsPageHostSettingDialogHost;

  /// No description provided for @settingsPageHostSettingDialogTestSucceed.
  ///
  /// In en, this message translates to:
  /// **'Succeed'**
  String get settingsPageHostSettingDialogTestSucceed;

  /// No description provided for @settingsPageHostSettingDialogTestFail.
  ///
  /// In en, this message translates to:
  /// **'Fail'**
  String get settingsPageHostSettingDialogTestFail;

  /// No description provided for @settingsPageHostSettingDialogTestBtn.
  ///
  /// In en, this message translates to:
  /// **'Test'**
  String get settingsPageHostSettingDialogTestBtn;

  /// No description provided for @settingsPageHostSettingDialogCancleBtn.
  ///
  /// In en, this message translates to:
  /// **'Cancle'**
  String get settingsPageHostSettingDialogCancleBtn;

  /// No description provided for @settingsPageHostSettingDialogConfirmBtn.
  ///
  /// In en, this message translates to:
  /// **'Confirm'**
  String get settingsPageHostSettingDialogConfirmBtn;

  /// No description provided for @settingsPageHostSettingTitle.
  ///
  /// In en, this message translates to:
  /// **'Specify host'**
  String get settingsPageHostSettingTitle;

  /// No description provided for @settingsPageHostSettingDesc.
  ///
  /// In en, this message translates to:
  /// **'If MaxKey is not working properly, you may need to change this'**
  String get settingsPageHostSettingDesc;

  /// No description provided for @settingsPageShowLogBtnTitle.
  ///
  /// In en, this message translates to:
  /// **'Check log'**
  String get settingsPageShowLogBtnTitle;

  /// No description provided for @settingsPageLogDisplayPageTitle.
  ///
  /// In en, this message translates to:
  /// **'Check log'**
  String get settingsPageLogDisplayPageTitle;

  /// No description provided for @settingsPageThemeModeSwitchTitle.
  ///
  /// In en, this message translates to:
  /// **'Theme'**
  String get settingsPageThemeModeSwitchTitle;

  /// No description provided for @userPageFullUserInfoDialogTitle.
  ///
  /// In en, this message translates to:
  /// **'User info'**
  String get userPageFullUserInfoDialogTitle;

  /// No description provided for @userPageFullUserInfoDialogDisplayName.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get userPageFullUserInfoDialogDisplayName;

  /// No description provided for @userPageFullUserInfoDialogUsername.
  ///
  /// In en, this message translates to:
  /// **'Username'**
  String get userPageFullUserInfoDialogUsername;

  /// No description provided for @userPageFullUserInfoDialogGender.
  ///
  /// In en, this message translates to:
  /// **'Gender'**
  String get userPageFullUserInfoDialogGender;

  /// No description provided for @userPageFullUserInfoDialogEmployeeNumber.
  ///
  /// In en, this message translates to:
  /// **'Employee ID'**
  String get userPageFullUserInfoDialogEmployeeNumber;

  /// No description provided for @userPageFullUserInfoDialogMobile.
  ///
  /// In en, this message translates to:
  /// **'Mobile'**
  String get userPageFullUserInfoDialogMobile;

  /// No description provided for @userPageFullUserInfoDialogEmail.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get userPageFullUserInfoDialogEmail;

  /// No description provided for @userPageFullUserInfoDialogUserType.
  ///
  /// In en, this message translates to:
  /// **'User type'**
  String get userPageFullUserInfoDialogUserType;

  /// No description provided for @userPageFullUserInfoDialogUserState.
  ///
  /// In en, this message translates to:
  /// **'User state'**
  String get userPageFullUserInfoDialogUserState;

  /// No description provided for @userPageFullUserInfoDialogIdType.
  ///
  /// In en, this message translates to:
  /// **'ID type'**
  String get userPageFullUserInfoDialogIdType;

  /// No description provided for @userPageFullUserInfoDialogIdCardNo.
  ///
  /// In en, this message translates to:
  /// **'ID card Nunber'**
  String get userPageFullUserInfoDialogIdCardNo;

  /// No description provided for @userPageFullUserInfoDialogMarried.
  ///
  /// In en, this message translates to:
  /// **'Married'**
  String get userPageFullUserInfoDialogMarried;

  /// No description provided for @userPageFullUserInfoDialogBirth.
  ///
  /// In en, this message translates to:
  /// **'Birth date'**
  String get userPageFullUserInfoDialogBirth;

  /// No description provided for @userPageFullUserInfoDialogOrganization.
  ///
  /// In en, this message translates to:
  /// **'Organization'**
  String get userPageFullUserInfoDialogOrganization;

  /// No description provided for @userPageFullUserInfoDialogDivision.
  ///
  /// In en, this message translates to:
  /// **'Division'**
  String get userPageFullUserInfoDialogDivision;

  /// No description provided for @userPageFullUserInfoDialogDepartmentId.
  ///
  /// In en, this message translates to:
  /// **'Department ID'**
  String get userPageFullUserInfoDialogDepartmentId;

  /// No description provided for @userPageFullUserInfoDialogDepartment.
  ///
  /// In en, this message translates to:
  /// **'Department'**
  String get userPageFullUserInfoDialogDepartment;

  /// No description provided for @userPageFullUserInfoDialogJobTitle.
  ///
  /// In en, this message translates to:
  /// **'Job title'**
  String get userPageFullUserInfoDialogJobTitle;

  /// No description provided for @userPageFullUserInfoDialogJobLevel.
  ///
  /// In en, this message translates to:
  /// **'Job level'**
  String get userPageFullUserInfoDialogJobLevel;

  /// No description provided for @userPageFullUserInfoDialogManager.
  ///
  /// In en, this message translates to:
  /// **'Manager'**
  String get userPageFullUserInfoDialogManager;

  /// No description provided for @userPageTitle.
  ///
  /// In en, this message translates to:
  /// **'User'**
  String get userPageTitle;

  /// No description provided for @userPageUserInfoBtn.
  ///
  /// In en, this message translates to:
  /// **'User info'**
  String get userPageUserInfoBtn;

  /// No description provided for @userPageSettingsBtn.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get userPageSettingsBtn;

  /// No description provided for @userPageLogoutBtn.
  ///
  /// In en, this message translates to:
  /// **'Logout'**
  String get userPageLogoutBtn;

  /// No description provided for @scanPagePermissionDeniedMsg.
  ///
  /// In en, this message translates to:
  /// **'Camera permissions are not granted.MaxKey requires camera permissions to scan the QR code and obtain a TOTP.'**
  String get scanPagePermissionDeniedMsg;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'zh'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'zh':
      return AppLocalizationsZh();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
