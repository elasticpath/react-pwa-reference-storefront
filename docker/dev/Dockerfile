# Build Command
# Run from project root
# docker build \
#   --tag ep/ep-store:$(jq -r .version package.json) \
#   --build-arg "BUILD_DATE"="$(date --rfc-3339=seconds)" \
#   --build-arg "VERSION"="$(jq -r .version package.json)" \
#   --build-arg "VCS_REF"="$(git rev-parse HEAD)"
#   -f ./docker/dev/Dockerfile .

FROM node:10.5.0

ARG BUILD_DATE
ARG VERSION
ARG VCS_REF

ENV CORTEX=http://localhost:9080
ENV STORE=vestri

LABEL build-date="$BUILD_DATE"
LABEL name="ep/ep-store"
LABEL description="Elastic Path reference store"
LABEL version="$VERSION"
LABEL vcs-ref="$VCS_REF"
LABEL docker-cmd="docker run --name ep-store -p 8080:8080 ep/ep-store:$VERSION"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN apt-get clean

# RUN apt-get update && \
# apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
# libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
# libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
# libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
# ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080

ENTRYPOINT [ "./docker/dev/entrypoint.sh" ]
CMD [ "npm", "start" ]
