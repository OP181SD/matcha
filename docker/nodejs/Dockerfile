FROM node:16

WORKDIR /app

COPY ./backend/package*.json ./

RUN npm install

RUN npm install pg

COPY ./backend /app

EXPOSE 5000

CMD ["npm", "start"]
