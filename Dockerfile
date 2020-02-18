FROM node:10

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

COPY . .

RUN npm install 

EXPOSE 3000

CMD ["npm", "run", "watch"]
