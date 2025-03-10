# Almost Uber App

A ride-sharing application inspired by Uber, developed to provide real-time ride booking and tracking functionalities.

## Features

- **Ride Booking**: Users can request rides by specifying pickup and drop-off locations.
- **Real-Time Tracking**: Monitor driver location and trip progress in real-time.
- **Trip History**: Access past ride details and receipts.

## Tech Stack

- **Backend**: Built with [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/) to handle API requests and business logic.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/KWhyms11/almost-uber-app.git
   cd almost-uber-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the application**:

   ```bash
   npm start
   ```

   The app should now be running at `http://localhost:3000`.

## Usage

- **Book a Ride**: Enter pickup and drop-off locations to request a ride.
- **Track Ride**: View driver's real-time location and estimated arrival time.
- **View Trip History**: Access details of previous rides.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**.
2. **Create a new branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**.
4. **Commit your changes**:

   ```bash
   git commit -m 'Add some feature'
   ```

5. **Push to the branch**:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a pull request**.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
