# UPI CryptoConnect

A secure and modern platform for cryptocurrency transactions using UPI integration.

## Features

- Secure user authentication
- Cryptocurrency tracking
- UPI payment integration
- Real-time transaction monitoring
- Flash loan functionality
- Bank account linking
- Modern UI with responsive design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Security middleware (helmet, rate-limiting)

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Context API for state management

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MongoDB
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/upi-cryptoconnect.git
cd upi-cryptoconnect
```

2. Install backend dependencies:
```bash
cd backend
cp .env.example .env  # Copy and configure environment variables
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

4. Configure environment variables:
- Backend: Edit `.env` file with your configuration
- Frontend: Create `.env` file with:
  ```
  VITE_BACKEND_URL=http://localhost:6900
  ```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd client
npm run dev
```

3. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:6900

## Security Features

- JWT-based authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Error handling
- Secure cookie settings

## API Documentation

### Authentication Endpoints
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/verify` - Verify JWT token

### Transaction Endpoints
- POST `/api/transactions` - Create transaction
- GET `/api/transactions` - Get user transactions
- GET `/api/transactions/filtered` - Get filtered transactions

### Bank Integration
- POST `/api/bank/add` - Add bank details
- GET `/api/bank/all-users` - Get all users
- GET `/api/bank/user-details` - Get logged user details

### Money Transfer
- POST `/api/money-transfer/create` - Create money transfer
- GET `/api/money-transfer` - Get transfer history

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- React Icons
- Tailwind CSS
- Chart.js
- ThirdWeb SDK
