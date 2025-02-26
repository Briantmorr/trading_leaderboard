# Trading Bots Leaderboard

A Next.js application that displays a leaderboard for trading bots using data from Firebase and account details fetched from the Alpaca paper trading API. Bots can be registered via an API endpoint, and their account values (including portfolio value and cash) are updated via another API endpoint.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Register Bot](#register-bot)
  - [Update Leaderboard](#update-leaderboard)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)
- [License](#license)

## Features

- **Bot Registration**: Register trading bots by providing a bot name and Alpaca account ID.
- **Live Leaderboard**: Display a table of bots showing rank, bot name, portfolio value (total account worth), and date created.
- **Real-Time Updates**: Firestore listeners update the leaderboard in real time.
- **Alpaca Integration**: Uses the [alpaca-trade-api-js](https://github.com/alpacahq/alpaca-trade-api-js) SDK to fetch account data from Alpaca.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- A Firebase project with Firestore enabled.
- Alpaca paper trading account credentials.

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/trading-bots-leaderboard.git
   cd trading-bots-leaderboard

2. **Install Dependencies:**

    ```bash
    npm install
3. **Install Tailwind CSS (if not already installed):**

    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
4. **Configure Tailwind:**
    ```js
    module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    };
## Environment Variables

Create a .env.local file in the project root with the following (replace the placeholder values with your actual credentials):

    ```env
    # Firebase Client Config (public)
    FIREBASE_SERVICE_ACCOUNT={service_account object credentials}
    TEAM_TOKEN=test
## API Endpoints
#### Register Bot
- Endpoint: /api/register-bot
- Method: POST
- Headers:
    - Content-Type: application/json
    - Authorization: Bearer YOUR_TEAM_TOKEN (if authorization is implemented)
- Payload:
    ```json
    {
    "bot_name": "algo_trading_brian",
    "alpaca_account_key": "PA3HW4R6GYF2",
    "alpaca_account_secret": "1234
    }

#### Update Leaderboard
- Endpoint: /api/update-leaderboard
- Method: POST
- Headers:
    - Content-Type: application/json
    - Authorization: Bearer YOUR_TEAM_TOKEN (if authorization is implemented)
- Response Example:
    ```json
    {
    "message": "Leaderboard updated successfully",
    "results": [
        {
            "bot": "algo_trading_brian",
            "status": "updated",
            "portfolio_value": 105000,
        },
        {
            "bot": "other_bot",
            "status": "failed",
            "error": "Error message"
        }
      ]
    }

