FROM alpine:3.20.3

RUN apk update && apk add inotify-tools openjdk21

COPY . /app
WORKDIR /app

# create user "spring" and create a home directory for it
RUN adduser -D spring && \
    chown -R spring:spring /app && \
    chmod -R 755 /app && \
    mkdir -p /home/spring/.gradle && \ 
    chown -R spring:spring /home/spring

USER spring
