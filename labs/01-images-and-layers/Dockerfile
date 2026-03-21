FROM nginx:alpine

LABEL maintainer="docker-lab"
LABEL description="Lab 01 - Understanding Docker image layers"

RUN apk add --no-cache curl

COPY index.html /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
