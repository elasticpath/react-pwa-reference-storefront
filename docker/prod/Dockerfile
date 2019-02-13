FROM node:10.9.0 as builder

WORKDIR /project

ADD ./package.json /project
ADD ./package-lock.json /project
RUN npm install
ADD ./ /project

# Install jq for inline JSON replacement
RUN apt-get update
RUN apt-get install jq

# Add additional replacements for configurations below as necessary
RUN jq -e '.cortexApi.scope|="NGINX_REPLACE_CORTEX_API_SCOPE"' ./src/ep.config.json > ./src/ep.config.json.tmp && cp ./src/ep.config.json.tmp ./src/ep.config.json

# Remove the temp file used for replacements since jq cannot handle in-line replacements
RUN rm ./src/ep.config.json.tmp

RUN npm run build

FROM nginx:1.15.1
COPY --from=builder /project/webpack/dist/ /usr/share/nginx/www
COPY ./docker/prod/nginx.conf /etc/nginx/conf.d/default.conf.template

ENV uri \$uri

CMD ["sh", "-c", "envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
