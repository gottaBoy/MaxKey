echo off

call setEnvVars.bat

docker -v

set START_TIME="%date:~0,10% %time:~0,2%:%time:~3,5%"
echo start time %START_TIME%

rem call Set-ExecutionPolicy RemoteSigned -Scope Process

cd ./Sophon-web-frontend/Sophon-web-app

rem Sophon-frontend:latest
rem push to docker hub
call docker push %ZE_REPOSITORY%/Sophon-frontend

rem Sophon-frontend:$version
call docker tag  %ZE_REPOSITORY%/Sophon-frontend %ZE_REPOSITORY%/Sophon-frontend:%ZE_VERSION%
rem push to docker hub
call docker push %ZE_REPOSITORY%/Sophon-frontend:%ZE_VERSION%

cd ../../

cd ./Sophon-web-frontend/Sophon-web-mgt-app


rem Sophon-mgt-frontend:latest
rem push to docker hub
call docker push %ZE_REPOSITORY%/Sophon-mgt-frontend

rem Sophon-mgt-frontend:$version
call docker tag %ZE_REPOSITORY%/Sophon-mgt-frontend %ZE_REPOSITORY%/Sophon-mgt-frontend:%ZE_VERSION%
rem push to docker hub
call docker push %ZE_REPOSITORY%/Sophon-mgt-frontend:%ZE_VERSION%

set END_TIME="%date:~0,10% %time:~0,2%:%time:~3,5%"

echo Build Release start at %START_TIME%  complete at %END_TIME%.

pause

