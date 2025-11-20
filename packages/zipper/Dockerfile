FROM node:22-alpine

# Copy over the source
WORKDIR /usr/src/zipper
COPY . .
RUN npm install && \
    npm run build

# Expose the run command
ENTRYPOINT ["./bin/run.js", "zip"]
