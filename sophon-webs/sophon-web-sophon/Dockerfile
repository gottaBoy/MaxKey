FROM eclipse-temurin:17-jdk-alpine

LABEL authors="Sophon <support@maxsso.net>"

RUN mkdir -p /Sophon

WORKDIR /Sophon

ARG JAR_FILE=build/libs/Sophon-boot-*-ga.jar

COPY ${JAR_FILE} Sophon-boot.jar

EXPOSE 9527

ENV TZ=Asia/Shanghai JAVA_OPTS="-Xms256m -Xmx2048m -Djava.security.egd=file:/dev/./urandom"

CMD sleep 60; java -jar Sophon-boot.jar $JAVA_OPTS
