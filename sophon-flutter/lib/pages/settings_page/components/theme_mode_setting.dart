part of '../page.dart';

class _ThemeModeSwitch extends StatefulWidget {
  const _ThemeModeSwitch({super.key});

  @override
  State<_ThemeModeSwitch> createState() => __ThemeModeSwitchState();
}

class __ThemeModeSwitchState extends State<_ThemeModeSwitch> {
  @override
  Widget build(BuildContext context) {
    return _SettingTile(
      title: AppLocalizations.of(context)!.settingsPageThemeModeSwitchTitle,
      action: SegmentedButton(
        showSelectedIcon: false,
        segments: ThemeMode.values
            .map(
              (item) => ButtonSegment(
                value: item,
                icon: switch (item) {
                  ThemeMode.system => const Icon(Icons.brightness_auto),
                  ThemeMode.light => const Icon(Icons.light_mode),
                  ThemeMode.dark => const Icon(Icons.dark_mode),
                },
              ),
            )
            .toList(),
        selected: {SophonPersistent.instance.themeMode},
        onSelectionChanged: (selected) {
          setState(() {
            SophonPersistent.instance.setThemeMode(selected.first);
          });
        },
      ),
    );
  }
}