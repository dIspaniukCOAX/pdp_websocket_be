FROM node:19.9.0

RUN apt-get update && \
    apt-get install -y \
     netcat \
     && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Add label for watchtower
LABEL com.centurylinklabs.watchtower.enable="true"

COPY package*.json ./

RUN npm install --force && npm i aws-sdk --force

COPY . .

RUN npm run build

ENTRYPOINT [ "./docker-entrypoint.sh" ]

EXPOSE 3000