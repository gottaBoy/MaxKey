FROM eclipse-temurin:17-jdk-alpine

LABEL authors="Sophon <support@maxsso.net>"

RUN mkdir -p /Sophon-openapi

WORKDIR /Sophon-openapi

ARG JAR_FILE=build/libs/Sophon-openapi-boot-*-ga.jar

COPY ${JAR_FILE} Sophon-openapi-boot.jar

EXPOSE 9525

ENV TZ=Asia/Shanghai JAVA_OPTS="-Xms256m -Xmx2048m -Djava.security.egd=file:/dev/./urandom"

CMD sleep 60; java -jar Sophon-openapi-boot.jar $JAVA_OPTS
