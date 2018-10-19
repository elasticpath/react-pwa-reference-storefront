FROM node:10.9.0 as builder

WORKDIR /project

ADD ./package.json /project
ADD ./package-lock.json /project
RUN npm install
ADD ./react-simple-chatbot.js /project/node_modules/react-simple-chatbot/dist
ADD ./ /project
RUN npm run build

FROM nginx:1.15.1
COPY --from=builder /project/webpack/dist/ /usr/share/nginx/www
