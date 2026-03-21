FROM node:20-alpine

WORKDIR /app

ARG VERSION=1.0

ENV APP_TITLE="Docker Environment Lab"
ENV APP_COLOR=blue
ENV APP_VERSION=${VERSION}

COPY app.js ./

CMD ["node", "app.js"]
