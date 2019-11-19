FROM node:12.10.0 as builder

ARG NPM_TOKEN
ARG GIT_URL

WORKDIR /project

ADD ./ /project

RUN npm set //registry.npmjs.org/:_authToken $NPM_TOKEN
RUN ./docker/components/components-publish.sh
