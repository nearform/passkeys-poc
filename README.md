![CI](https://github.com/nearform/hub-template/actions/workflows/ci.yml/badge.svg?event=push)

# Passkeys Experiment

an experiment for a React app and a fastify server to use passkeys for authentcation.

to run the experiment run:

`npm i`

`docker-compose up -d`

to spin up the mongo db instance to store the users

`npm run dev --workspace=server`

`npm run start --workspace=frontend`

open http://localhost:3000 in your browser
