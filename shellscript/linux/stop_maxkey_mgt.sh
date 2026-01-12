kill -9 $(ps -ef|grep SophonMgtBoot|grep -v grep|awk '{print $2}')

