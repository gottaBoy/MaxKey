import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:sophon_flutter/maxkey/maxkey.dart';
import 'package:sophon_flutter/maxkey/services/users.service.dart';
import 'package:sophon_flutter/persistent.dart';
import 'package:sophon_flutter/repeat_tween_animation_builder.dart';
import 'package:sophon_flutter/totp.dart';
import 'package:sophon_flutter/utils.dart';
import 'package:sophon_flutter/l10n/app_localizations.dart';

part 'components/new_totp_btn.dart';
part 'components/totp_list_view.dart';
part 'components/user_card.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  var profile = MaxKey.instance.usersService.getBasicUserInfo();
  final controller = _TotpListViewController();

  void _update() {
    setState(() {
      profile = MaxKey.instance.usersService.getBasicUserInfo();
    });
  }

  @override
  void initState() {
    super.initState();
    MaxKey.instance.addListener(_update);
  }

  @override
  void dispose() {
    super.dispose();
    MaxKey.instance.removeListener(_update);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              FutureBuilder(
                future: profile,
                builder: (context, snapshot) {
                  if (snapshot.data == null) {
                    return const _LoadingUserCard();
                  }

                  return _UserCard(user: snapshot.data!);
                },
              ),
              const SizedBox(height: 8),
              _NewTotpBtn(controller: controller),
              const SizedBox(height: 8),
              _TotpListView(controller: controller),
            ],
          ),
        ),
      ),
    );
  }
}
