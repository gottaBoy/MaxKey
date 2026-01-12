echo off

call setEnvVars.bat

docker -v

set START_TIME="%date:~0,10% %time:~0,2%:%time:~3,5%"
echo start time %START_TIME%

rem call Set-ExecutionPolicy RemoteSigned -Scope Process

cd ./Sophon-webs/Sophon-web-Sophon

call docker build -f Dockerfile -t %ZE_REPOSITORY%/Sophon  .

rem Sophon:latest
rem push to docker hub
call docker push %ZE_REPOSITORY%/Sophon

rem Sophon:$version
call docker tag  %ZE_REPOSITORY%/Sophon %ZE_REPOSITORY%/Sophon:%ZE_VERSION%
rem push to docker hub
call docker push %ZE_REPOSITORY%/Sophon:%ZE_VERSION%

cd ../../

cd ./Sophon-webs/Sophon-web-mgt

call docker build -f Dockerfile -t %ZE_REPOSITORY%/Sophon-mgt  .

rem Sophon-mgt:latest
rem push to docker hub
call docker push %ZE_REPOSITORY%/Sophon-mgt

rem Sophon-mgt:$version
call docker tag %ZE_REPOSITORY%/Sophon-mgt %ZE_REPOSITORY%/Sophon-mgt:%ZE_VERSION%
rem push to docker hub
call docker push %ZE_REPOSITORY%/Sophon-mgt:%ZE_VERSION%

set END_TIME="%date:~0,10% %time:~0,2%:%time:~3,5%"

echo Build Release start at %START_TIME%  complete at %END_TIME%.

pause

