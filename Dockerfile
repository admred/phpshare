FROM alpine:3.21

RUN apk add --no-cache php83 php83-fileinfo

WORKDIR /var/www/html

# https://github.com/admred/phpshare/archive/refs/heads/master.zip
#ADD /src /var/www/html

EXPOSE 8080/tcp

CMD ["php","-c","user.ini","-S","0.0.0.0:8080","-t","."]
