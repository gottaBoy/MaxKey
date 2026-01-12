kill -9 $(ps -ef|grep SophonBoot|grep -v grep|awk '{print $2}')


