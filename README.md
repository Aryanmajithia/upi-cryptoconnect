# UPI CryptoConnect

A modern web application that integrates UPI payments with cryptocurrency transactions, providing a seamless interface for managing both traditional and digital currency operations.

## Features

- **UPI Integration**: Seamless UPI payment processing
- **Cryptocurrency Support**: Track and manage crypto transactions
- **User Authentication**: Secure login and registration system
- **Transaction Management**: View and manage all transactions
- **Dashboard**: Real-time overview of financial activities
- **Profile Management**: User profile and settings
- **Scratch Cards**: Interactive reward system

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- ThirdWeb SDK
- Chart.js
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Razorpay Integration

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn
- Git

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd upi-cryptoconnect
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../client
npm install
```

4. Create environment files:
   - Create `.env` in the backend directory with:
   ```
   PORT=1000
   MONGO_URL=mongodb://localhost:27017/upi-cryptoconnect
   JWT_SECRET=your_secure_jwt_secret_123
   CURRENCY_API_KEY=your_currency_api_key
   CRYPTO_API_KEY=your_crypto_api_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

## Running the Application

1. Start MongoDB:

```bash
mongod
```

2. Start the backend server:

```bash
cd backend
npm start
```

3. Start the frontend development server:

```bash
cd client
npm run dev
```

4. Access the application:

- Frontend: http://localhost:6900
- Backend API: http://localhost:6900

## Project Structure

```
upi-cryptoconnect/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── .env
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── public/
└── README.md
```

## API Endpoints

- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/transactions` - Transaction management
- `/api/crypto` - Cryptocurrency operations
- `/api/upi` - UPI payment processing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository.
