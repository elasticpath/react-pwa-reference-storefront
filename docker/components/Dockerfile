FROM node:12.10.0 as builder

ARG NPM_TOKEN

WORKDIR /project

ADD ./ /project

# Publish components to npm
RUN npm set //registry.npmjs.org/:_authToken $NPM_TOKEN
RUN ./components-publish.sh
