
######### DEVELOPMENT INSTRUCTION ###########

Project is build on Angular (https://angular.io/).

Here are the steps with instruction and note on how to setup the project :

[note: $ means run the command in your command prompt]

1. Install node and npm (if you don't have that in your machine):
https://nodejs.org/en/download/
[Note: verify that you are running at least node 6.9.x and npm 3.x.x by running following commands in a terminal/console window:

$ node -v
$ npm -v

If you have downloaded or already have newer versions that's fine]

2. Clone the repo :

$ git clone https://github.com/maksoodmohiuddin/angular5-reference-app.git

3. cd into the repo and then to the app folder: LFTInterpretationApp

4. Run NPM install:
$ npm install

[note: this is the magic part with node package manager (npm) -
here node along with setting from package.json file will download
all the required frameworks and dependent libraries,
please be patient as this might takes some time depending on your internet connection,
also you can ignore the warnings, if there's error it will display a message describing error and how to remediate]

5. Run the app:
$ npm start
[webpack will build the app, chunked it for optimization and serve it at http://localhost:4200/
open your browser and navigate to http://localhost:4200/]
 please brows there in ]

################################################

############# DOCKER INSTRUCTION ###############

1. Install Docker and get oriented with it: https://docs.docker.com/get-started/
>> Get get oriented with it - run the hello-world example

2. Build Docker PROD image: $ docker build -t ng-app:prod .
>> make sure include the "." at the end

3. Check Docker Image: $docker image ls
>> There should be an image ng-app with prod tag.

4. Run Docker PROD image: $ docker run -p 80:80 ng-app:prod
>> Browse to http://localhost to launch the app

5. Build Docker DEV image: $ docker build -t ng-app:dev --build-arg env=dev .
>> make sure include the "." at the end

6. Check Docker Image: $docker image ls
>> There should be an image ng-app with dev tag.

7. Run Docker DEV image: $ docker run -p 80:80 ng-app:dev
>> Browse to http://localhost to launch the app

8. Build and Run App using Docker Compose: $ docker-compose up
>> Browse to http://localhost to launch the app

9. Stop App using Docker Compose: $ docker-compose down
>> you have to ctrl-c first

####################################################




