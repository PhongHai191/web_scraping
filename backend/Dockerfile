FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend .
COPY db ./db
EXPOSE 3000
CMD ["node", "app.js"]