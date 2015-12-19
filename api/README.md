# URL shortener API

## Overview

* AWS Lambda based microservice behind AWS API Gateway
* DynamoDB-backed storage
* ES6 JavaScript
* Configured to log to console, but can be changed to use AWS CloudWatch in seconds
* Counts number or URL uses and creation date

## Development

You must have an AWS SDK configured to run the development server.

1. `npm install`
2. `nodemon` or `npm start`

Then open `http://localhost:3100/url-read` or any other path from `./server` to test API.

## Configuration

Change variables in `./src/config.js` and `./lambda-config.js`

## Deployment

Run `gulp deploy` to package and upload to AWS.

## Production environment

An API is running at `http://n0xxtvs7a3.execute-api.eu-west-1.amazonaws.com/prod` and the main application is configured against it.
