FROM node:18-alpine

WORKDIR /app

COPY package*.json /app/


RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 80

CMD ["npm", "run", "serve"]