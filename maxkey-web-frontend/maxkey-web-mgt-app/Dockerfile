#Sophon Mgt Frontend Docker Build

FROM node:16.14.2
#FROM node:16.14.2 as builder

LABEL authors="Sophon <support@maxsso.net>"

WORKDIR /usr/src/app

COPY package.json package.json

RUN npm config set registry https://registry.npm.taobao.org \
    && npm i

COPY ./src  ./src
RUN npm install -g @angular/cli

RUN ng build --prod --base-href /Sophon-mgt/

FROM nginx

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

#RUN rm -rf /usr/share/nginx/html/*

COPY  dist /usr/share/nginx/html/Sophon-mgt
#COPY  --from=builder /usr/src/app/dist /usr/share/nginx/html/Sophon-mgt

#CMD ["nginx", "-g", "daemon off;"]

EXPOSE 8526

