FROM alpine:3.21

RUN apk add --no-cache php83 php83-fileinfo

ARG user=alpine
ARG passwd

RUN adduser -D $user && \
    echo "$user:$passwd" | chpasswd

RUN mkdir -p /var/www/html && chown -R 1000:1000 /var/www/*

RUN chmod 1777 /tmp

USER $user
WORKDIR /var/www/html

EXPOSE 8080/tcp

CMD ["php","-c","user.ini","-S","0.0.0.0:8080","-t","."]
