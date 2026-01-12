echo off

call setEnvVars.bat

set START_TIME="%date:~0,10% %time:~0,2%:%time:~3,5%"
echo start time %START_TIME%

rem call Set-ExecutionPolicy RemoteSigned -Scope Process

cd ./Sophon-web-frontend/Sophon-web-app

call ng     build --base-href /Sophon/

cd ../../

cd ./Sophon-web-frontend/Sophon-web-mgt-app

call ng     build --base-href /Sophon-mgt/

set END_TIME="%date:~0,10% %time:~0,2%:%time:~3,5%"

echo Build Release start at %START_TIME%  complete at %END_TIME%.

pause

