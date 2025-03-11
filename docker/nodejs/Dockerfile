FROM node:18

WORKDIR /app

COPY ./backend/package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY ./backend/ . 

EXPOSE 5001


CMD ["npm", "run", "start"]