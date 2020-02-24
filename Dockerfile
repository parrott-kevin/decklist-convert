FROM node:erbium-alpine

RUN mkdir -p /www
WORKDIR /www

COPY . /www
RUN yarn install

EXPOSE 3000

CMD ["/bin/ash"]
