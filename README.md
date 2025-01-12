<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="[https://github.com/github_username/repo_name](https://github.com/ice188/crypto-tracker)">
    <img src="img/logo.png" alt="Logo">
  </a>

  <p align="center"><br />
    Real-time cryptocurrency tracking and alert system using microservices to deliver notifications and data analysis.
    <br />
    <br />
  </p>
</div>

## Project Highlight

- Apache Kafka for realtime streaming of crypto data from CoinGecko API 
- AWS S3 to archive price and volume data and display in interactive charts
- Firebase Realtime database to synchronize API data in crypto list every 10 seconds
- PostgreSQL ORM for storing OAuth user data and alert data
- RabbitMQ to store triggered alerts in queue structure
- Firebase Cloud Messaging to process triggered alerts and push notification to client's browser
- Fully responsive frontend with React and TailwindCSS

## Features

- Landing

<div align="middle">
  <img src="img/landing.png" width="300" />
</div>

- Explore Crypto
  - list of all cryptos with price and 24h percentage change
  - work flow: kafka produce api data from coinGecko API and publish to topic, consumer process data and store result to firebase. Frontend reads data from firebase

<div align="middle">
  <img src="img/crypto-list.png" width="300" />
</div>

- Crypto Detail
  - interactive chart of price and volume data
  - work flow: kafka consumer stores price and volume data to AWS-S3, frontend fetch data and display them in charts

<div align="middle">
  <img src="img/chart.png" width="300" />
  <img src="img/volume-chart.png" width="300" /> 
</div>

- Authentication
  - OAuth2 Login through google/github 
  - work flow: retrieve access token through OAuth API -> get auth token -> get user payload -> store in database

  <div align="middle">
    <img src="img/login.png" width="300" /> 
  </div>

- Set Alerts
  - (once user is logged in) add custom alert when price/% exceeds user-defined threshold
  - push alert to browser using Firebase Cloud Messaging when condition is met 
  - workflow: kafka consumer detects alert triggers -> store to rabbitMQ -> read queue in notification service and send to FCM for display

<div align="middle">
  <img src="img/alert.png" width="300" />
</div>

## Fix Log

## Side Notes
