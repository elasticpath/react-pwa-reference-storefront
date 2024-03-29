FROM node:12.10.0 as builder

ARG NPM_TOKEN

WORKDIR /project

ADD ./ /project

RUN yarn

RUN echo "deb http://http.debian.net/debian jessie main contrib\n\
deb-src http://http.debian.net/debian jessie main contrib\n\
deb http://security.debian.org/ jessie/updates main contrib\n\
deb-src http://security.debian.org/ jessie/updates main contrib" >/etc/apt/source.list

RUN echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/90ignore-release-date

# Install jq for inline JSON replacement
RUN apt-get clean
RUN apt-get update
RUN apt-get install -y jq

# Add additional replacements for configurations below as necessary
RUN jq -e '.cortexApi.scope|="NGINX_REPLACE_CORTEX_API_SCOPE"' ./src/ep.config.json > ./src/ep.config.json.tmp && cp ./src/ep.config.json.tmp ./src/ep.config.json

# Remove the temp file used for replacements since jq cannot handle in-line replacements
RUN rm ./src/ep.config.json.tmp

RUN yarn build

FROM nginx:1.15.1
COPY --from=builder /project/build/ /usr/share/nginx/www
COPY ./docker/prod/nginx.conf /etc/nginx/conf.d/default.conf.template

ENV uri \$uri

CMD ["sh", "-c", "envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
