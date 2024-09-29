FROM node:20.9.0-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
