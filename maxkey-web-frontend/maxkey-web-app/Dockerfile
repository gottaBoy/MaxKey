#Sophon Frontend Docker Build

FROM node:16.14.2
#FROM node:16.14.2 as builder

LABEL authors="Sophon <support@maxsso.net>"

WORKDIR /usr/src/app

COPY package.json package.json

RUN npm config set registry https://registry.npm.taobao.org \
    && npm i

COPY ./src  ./src
RUN npm install -g @angular/cli

RUN ng build --prod --base-href /Sophon/

FROM nginx

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

#RUN rm -rf /usr/share/nginx/html/*

COPY  dist /usr/share/nginx/html/Sophon
#COPY  --from=builder /usr/src/app/dist /usr/share/nginx/html/Sophon

#CMD ["nginx", "-g", "daemon off;"]

EXPOSE 8527

