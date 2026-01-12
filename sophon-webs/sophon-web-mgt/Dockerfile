FROM eclipse-temurin:17-jdk-alpine

LABEL authors="Sophon <support@maxsso.net>"

RUN mkdir -p /Sophon-mgt

WORKDIR /Sophon-mgt

ARG JAR_FILE=build/libs/Sophon-mgt-boot-*-ga.jar

COPY ${JAR_FILE} Sophon-mgt-boot.jar

EXPOSE 9526

ENV TZ=Asia/Shanghai JAVA_OPTS="-Xms256m -Xmx2048m -Djava.security.egd=file:/dev/./urandom"

CMD sleep 60; java -jar Sophon-mgt-boot.jar $JAVA_OPTS
