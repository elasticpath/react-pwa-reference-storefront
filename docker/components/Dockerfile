FROM node:12.10.0 as builder

ARG NPM_TOKEN
ARG GIT_URL

WORKDIR /project

ADD ./ /project

RUN npm set //registry.npmjs.org/:_authToken $NPM_TOKEN
RUN git config --global user.name 'cibuild'
RUN git config --global user.email 'build@admin'
RUN ./docker/components/components-publish.sh
