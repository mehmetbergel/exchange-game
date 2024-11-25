# EvaExchange - Trading Game Backend

This backend application provides RESTful APIs for managing user portfolios and facilitating share trading operations.

## Features

- **Share Management**: Register shares with a unique 3-character symbol and update their hourly prices.
- **Trading Operations**: Supports **BUY** and **SELL** trades based on the latest share prices.
- **Portfolio Validation**: Ensures users have registered portfolios for trading.

## Tech Stack

- **Backend Framework**: NestJS
- **ORM**: TypeORM
- **Database**: MySQL

## Installation

1. Install dependencies:  
   ```bash
   npm install

2. Configure the environment:  
   ```bash
   Rename env.development to .env.
   
3. Start the application:
   ```bash
   docker compose up  
   npm run start
