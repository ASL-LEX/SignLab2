## Overview
SignLab is the web application built for tagging videos and still images with user-generated data. It is designed to support research groups each creating their own studies based on their own entry data.

The Signlab can isolate different research organizations, their projects, and their studies, which enables many users to leverage SignLab at the same time.

## Technical Architecture

![technical architecture](https://github.com/ASL-LEX/SignLab2/assets/144057115/c09013b4-9930-484e-ac23-df80aa36bd52)

## How to Run the project
To start the application, you need to run different commands in separate terminal windows. This is because the application consists of multiple parts (server, gateway, client), each requiring its own terminal session.

# Server and Gateway:
- Open two terminal windows.
- Navigate to the root directory of the project for both terminal windows.
- Navigate to the `packages/server/` directory and `packages/gateway/` directory respectively.
- Run the following command for both terminal windows to start the server and gateway concurrently: `npm run start:dev`
- This command will start the server and the gateway, allowing them to communicate with each other.

# Client:
- Open another terminal window (different from the one used for the server and gateway).
- Navigate to the root directory of the project.
- Navigate to the `packages/client/` directory
- Run the following command to start the client: `npm run dev`
- This command will start the client application (front-end), allowing you to interact with the server and gateway through the user interface.

By running these commands in separate terminal windows, you can effectively start all parts of the application and develop or test them simultaneously. Ensure that all parts are running smoothly to have the full application functionality available during development.

## Current Known Issues (in detail)-
Working on merging Catch trials feature(Currently in open Pull Request).
https://github.com/ASL-LEX/SignLab2/pulls

## Deployment
Video Demo link: https://drive.google.com/file/d/1PyQTgFd47gEXw9En6BAXY-jn7BOZ4DoH/view?usp=drive_link
