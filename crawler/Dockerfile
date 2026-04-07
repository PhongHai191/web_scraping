FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

USER root

COPY crawler/package*.json ./
RUN npm install
RUN npx puppeteer browsers install chrome

COPY crawler .
COPY db ./db
RUN chown -R pptruser:pptruser /app
USER pptruser
RUN npx puppeteer browsers install chrome

CMD ["node", "worker/worker.js"]