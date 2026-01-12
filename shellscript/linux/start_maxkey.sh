#!/bin/bash
source ./set_Sophon_env.sh

JAVA_MARK=SophonBoot
JAVA_OPTS=" -Xms256m "
JAVA_OPTS="${JAVA_OPTS} -Xmx2048m"
JAVA_OPTS="${JAVA_OPTS} -Dfile.encoding=UTF-8"
JAVA_OPTS="${JAVA_OPTS} -DjavaMark=${JAVA_MARK}"

JAVA_CONF=./Sophon
JAVA_LIBSophonPATH=./Sophon
JAVA_CLASSPATH=./classes:./bin:$JAVA_CONF:
JAVA_MAINCLASS=org.zeron.sophon.SophonApplication
JAVA_EXEC=$JAVA_HOME/bin/java

export JAVA_CLASSPATH
export JAVA_LIBPATH
export JAVA_LIBSophonPATH


for LL in `ls $JAVA_LIBSophonPATH/*.jar`
        do
                JAVA_CLASSPATH=$LL
               
done

export JAVA_CLASSPATH
# Display our environment
echo "-------------------------------------------------------------------------------"
echo "  Bootstrap Environment"
echo ""
echo JAVA_CLASSPATH :  ${JAVA_CLASSPATH}
echo JAVA_CONF      :  $JAVA_CONF
echo JAVA_OPTS      :  $JAVA_OPTS
echo JAVA_HOME      :  $JAVA_HOME  
echo JAVA           :  $JAVA_EXEC
${JAVA_EXEC} -version
echo ""
echo "-------------------------------------------------------------------------------"
echo ""

nohup $JAVA_EXEC -jar $JAVA_OPTS $JAVA_CLASSPATH >./logs/nohup_Sophon.out 2>&1 &

echo Sophon is starting锛寉ou can check the ./logs/nohup_Sophon.out

