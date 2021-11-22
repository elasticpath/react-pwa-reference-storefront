# Build Command
# Run from project root
# docker build \
#   --tag ep/ep-store:$(jq -r .version package.json) \
#   --build-arg "BUILD_DATE"="$(date --rfc-3339=seconds)" \
#   --build-arg "VERSION"="$(jq -r .version package.json)" \
#   --build-arg "VCS_REF"="$(git rev-parse HEAD)"
#   -f ./docker/dev/Dockerfile .

FROM node:12.10.0

ARG BUILD_DATE
ARG VERSION
ARG VCS_REF
ARG SCOPE=vestri

ENV CORTEX=http://localhost:9080
ENV STORE="$SCOPE"

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
COPY yarn.lock ./

RUN echo "deb http://deb.debian.org/debian/ jessie main \n\
deb-src http://deb.debian.org/debian/ jessie main \n\
deb http://security.debian.org/ jessie/updates main \n\
deb-src http://security.debian.org/ jessie/updates main \n\
deb [check-valid-until=no] http://archive.debian.org/debian jessie-backports main \n\
deb-src [check-valid-until=no] http://archive.debian.org/debian jessie-backports main" > /etc/apt/sources.list

RUN echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/90ignore-release-date

RUN apt-get clean && \
apt-get update && \
apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# Bundle app source
COPY . .

RUN yarn

EXPOSE 8080

ENTRYPOINT [ "./docker/dev/entrypoint.sh" ]
CMD [ "yarn", "start" ]
