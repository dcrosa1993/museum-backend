# --------------------------
# 1. Build stage
# --------------------------
FROM node:24-bookworm-slim AS builder

ARG DB_HOST
ENV DB_HOST=${DB_HOST}
ARG DB_PORT
ENV DB_PORT=${DB_PORT}
ARG DB_NAME
ENV DB_NAME=${DB_NAME}
ARG DB_USER
ENV DB_USER=${DB_USER}
ARG DB_PASSWORD
ENV DB_PASSWORD=${DB_PASSWORD}

ARG FIREBASE_PROJECT_ID
ENV FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
ARG FIREBASE_CLIENT_EMAIL
ENV FIREBASE_CLIENT_EMAIL=${FIREBASE_CLIENT_EMAIL}
ARG FIREBASE_PRIVATE_KEY
ENV SECRET_FILE=${FIREBASE_PRIVATE_KEY}
ENV FIREBASE_SERVICE_ACCOUNT_PATH=/app/src/config/firebase-service-account.json
ARG INITIAL_ADMIN_EMAIL
ENV INITIAL_ADMIN_EMAIL=${INITIAL_ADMIN_EMAIL}


WORKDIR /app

# Prevent Puppeteer from downloading Chrome during npm install.
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Copy dependency files
COPY package*.json ./
RUN mkdir -p ./src/config
RUN chmod -R 777 ./src/config
RUN printf '%s' "$SECRET_FILE" > ./src/config/firebase-service-account.json
RUN cat ./src/config/firebase-service-account.json

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build NestJS
RUN npm run build


# --------------------------
# 2. Production stage
# --------------------------
FROM node:24-bookworm-slim

ARG DB_HOST
ENV DB_HOST=${DB_HOST}
ARG DB_PORT
ENV DB_PORT=${DB_PORT}
ARG DB_NAME
ENV DB_NAME=${DB_NAME}
ARG DB_USER
ENV DB_USER=${DB_USER}
ARG DB_PASSWORD
ENV DB_PASSWORD=${DB_PASSWORD}

ARG FIREBASE_PROJECT_ID
ENV FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
ARG FIREBASE_CLIENT_EMAIL
ENV FIREBASE_CLIENT_EMAIL=${FIREBASE_CLIENT_EMAIL}
ENV FIREBASE_SERVICE_ACCOUNT_PATH=/app/src/config/firebase-service-account.json
ARG INITIAL_ADMIN_EMAIL
ENV INITIAL_ADMIN_EMAIL=${INITIAL_ADMIN_EMAIL}

WORKDIR /app

ENV NODE_ENV=production

# Copy dependency files
COPY package*.json ./

# Install production dependencies without downloading Chrome
RUN npm ci --omit=dev

# Copy compiled application
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]