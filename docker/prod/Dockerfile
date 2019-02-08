FROM node:10.9.0 as builder

WORKDIR /project

ADD ./package.json /project
ADD ./package-lock.json /project
RUN npm install
ADD ./ /project
RUN npm run build

FROM nginx:1.15.1
COPY --from=builder /project/webpack/dist/ /usr/share/nginx/www
COPY ./docker/prod/nginx.conf /etc/nginx/conf.d/default.conf.template

ENV uri \$uri

CMD ["sh", "-c", "envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
