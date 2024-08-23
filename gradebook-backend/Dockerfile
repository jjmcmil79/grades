# FROM node:14

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["node", "index.js"]


FROM node:14

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Copy the entire application, including the migration file
COPY . .

EXPOSE 3000

# Run migration and start the app
CMD /bin/bash -c 'while !</dev/tcp/db/5432; do sleep 1; done; \
    PGPASSWORD=$POSTGRES_PASSWORD psql -U $POSTGRES_USER -d $POSTGRES_DB -h db -f ./db/migration.sql && \
    node index.js'
